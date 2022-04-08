// eslint-disable-next-line no-unused-vars
import NotionPage from "../../../models/notion-page.js";
import PageEvent from "../../../models/page-event.js";
import { Progress } from "../../../models/selections-map.js";

/**
 * Updates a google calendar `event` based on a {@link NotionPage} object where
 * the `event`'s `eventId` is acquired by searching the `pageevents` collection
 * using `page.id` or `page.name` as the `title` field. After updating the event
 * in `calendar`, the found `PageEvent` document is updated, saved and returned.
 *
 * @param {import("googleapis").calendar_v3.Calendar} calendar
 *
 * @param {string} calendarId
 *
 * @param {NotionPage} page
 *
 */
const updatePageToEvent = async (calendar, calendarId, page) => {
	// Destructure notion page
	const {
		id: pageId,
		name,
		date: {
			end,
			start
		},
		progress: { id: progressId },
	} = page;

	const pageMemo = await PageEvent.findOne({
		$or : [
			{ pageId },
			{ title : name }
		]
	});

	// Update event in gcal
	const updatedEvent = await calendar.events.patch({
		calendarId,
		eventId     : pageMemo.eventId,
		requestBody : {
			end     : { dateTime : end },
			start   : { dateTime : start },
			status  : Progress["Cancelled"] === progressId ? "cancelled" : "confirmed",
			summary : name,
		}
	});

	// Update our memo in database
	pageMemo.date.end = end;
	pageMemo.date.start = start;
	pageMemo.eventId = updatedEvent.data.id;
	pageMemo.pageId = pageId;
	pageMemo.title = name;
	pageMemo.status = updatedEvent.data.status;

	return await pageMemo.save();
};

export default updatePageToEvent;