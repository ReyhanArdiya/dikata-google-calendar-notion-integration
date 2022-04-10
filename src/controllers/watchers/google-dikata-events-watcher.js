import PageEvent from "../../models/page-event.js";
import Watcher from "./watcher.js";
import compareNowWithRange from "../../helpers/dates/compare-now-with-range.js";
import isDikataEvent from "../../helpers/google-calendar/events/is-dikata-event.js";
import listDikataEvents from "../../helpers/google-calendar/events/list-dikata-events.js";
import pageEventController from "../page-event-controller/index.js";
import { Progress, Type } from "../../models/selections-map.js";

/**
 * Watches for changes in google `calendar` `events` and then `update`, `insert` and
 * `cancel` `notion` page's accordingly. When this class is instantiated,
 * it will "scan" the `calendar` for changes once before starting its interval.
 */
class GoogleDikataEventsWatcher extends Watcher {
	#syncToken = null;

	/**
	 *
	 * @param {import("googleapis").calendar_v3.Calendar} calendar
	 *
	 * @param {string} calendarId
	 *
	 * @param {import("@notionhq/client").Client} notion
	 *
	 * @param {string} databaseId
	 *
	 * @param {number} ms
	 */
	constructor(calendar, calendarId, notion, databaseId, ms) {
		/**
		 * The watchingFn will be making an initial sync to google {@link calendar}
		 * and then repeteadly sync and passing the returned events array
		 * to {@link processDikataEvents}.
		 */
		const watchAndSyncDikataEvents = async () => {
			let dikataEvents;
			let syncToken;

			// Initial sync
			if (!this.#syncToken) {
				const { items, nextSyncToken } = await listDikataEvents(
					calendar,
					calendarId,
				);

				dikataEvents = items;
				syncToken = nextSyncToken;
			} else {
				// Sync with new changes from previous
				const {
					data: {
						items,
						nextSyncToken
					}
				} = await calendar.events.list(
					{
						calendarId,
						syncToken : this.#syncToken
					}
				);

				dikataEvents = items;
				syncToken = nextSyncToken;
			}

			this.#syncToken = syncToken;

			return dikataEvents;
		};

		/**
		 * Processes {@link dikataEvents} to update, insert or cancel relevant
		 * pages in the `noiton` agenda database.
		 *
		 * @param {import("googleapis").calendar_v3.Schema$Event[]} dikataEvents
		 * The synced dikata events array returned by {@link watchAndSyncDikataEvents}
		 */
		const processDikataEvents = async dikataEvents => {
			for (const dikataEvent of dikataEvents) {
				// Sadly when syncing with gcal again using the previous sync token
				// we can't filter by "Dikata:" anymore using listDikataEvents,
				// so we do this to not include events that aren't Dikata
				if (
					// We need to check if summary is there or not first since when deleting an event
					// we'll get an object without the summary property
					dikataEvent.summary &&
					// Then, if it's not the event we want, we can just skip it
					!isDikataEvent(dikataEvent.summary)
				) {
					continue;
				}

				// Try to find the PageEvent for this dikataEvent
				const currentPageEvent = await PageEvent.findOne({
					$or : [
						{ eventId : dikataEvent.id },
						{ title : dikataEvent.summary }
					]
				});

				// CMT I use continue here instead of else to avoid the indentation

				// Cancelled is when this dikataEvent status is "cancelled" and
				// we have it in our database
				if (dikataEvent.status === "cancelled" && currentPageEvent) {
					// Cancel (not archive) in notion
					await notion.pages.update({
						"page_id"  : currentPageEvent?.pageId,
						// eslint-disable-next-line max-len
						properties : { Progress : { select : { id : Progress.Cancelled } } }
					});

					// Change status in the database
					currentPageEvent.status = "cancelled";
					await currentPageEvent.save();

					// We don't delete the PageEvent of the page from
					// database since we still might be able to change it again
					// from cancelled into something else later in notion
					continue;
				}

				// New is when we don't have this dikataEvent in PageEvents
				if (!currentPageEvent) {
					// Create in notion and maps it into database
					await pageEventController.create.insertEventToPage({
						databaseId,
						event      : dikataEvent,
						notion,
						// Automatically picks the right progress
						progressId : Progress[compareNowWithRange(
							dikataEvent.start.dateTime,
							dikataEvent.end.dateTime
						)],
						typeId : Type["Department Meeting"]
						// notionSummary : `${dikataEvent.summary} will start at ${dikataEvent.start.dateTime} and end at ${dikataEvent.end.dateTime}`,
					});

					// No need to continue this loop
					continue;
				}

				// If the page wasn't new or cancelled, it could be updated
				const {
					summary: eventTitle,
					start: { dateTime: eventStart },
					end: { dateTime: eventEnd },
					status: eventStatus
				} = dikataEvent;

				// Check for differences
				const isTitleDiff = eventTitle !== currentPageEvent.title;
				const isStartDiff = eventStart !== currentPageEvent.date.start;
				const isEndDiff = eventEnd !== currentPageEvent.date.end;
				const isStatusDiff = eventStatus !== currentPageEvent.status;

				// If there are differences, we need to update
				if (isTitleDiff || isStartDiff || isEndDiff || isStatusDiff) {
					// Update in notion & database
					await pageEventController.update.updateEventToPage(
						notion,
						dikataEvent
					);
				}
			}
		};

		const catchError = err => console.error(err);

		super(
			watchAndSyncDikataEvents,
			processDikataEvents,
			catchError,
			ms
		);

		this.activate(true);
	}
}

export default GoogleDikataEventsWatcher;