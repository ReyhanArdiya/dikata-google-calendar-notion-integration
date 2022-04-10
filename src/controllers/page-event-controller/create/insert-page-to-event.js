// eslint-disable-next-line no-unused-vars
import NotionPage from "../../../models/notion-page.js";
import PageEvent from "../../../models/page-event.js";
import isDikataEvent from "../../../helpers/google-calendar/events/is-dikata-event.js";
import mapPageEvent from "./map-page-event.js";

/**
 * Inserts a {@link NotionPage} to a {@link calendar} `event` and maps it
 * to the database with {@link mapPageEvent} then returns a promise
 * which resolves into the `PageEvent` document.
 *
 * @param {import("googleapis").calendar_v3.Calendar} calendar
 *
 * @param {string} calendarId
 *
 * @param {NotionPage} page
 *
 * @param {number} colorId
 */
const insertPageToEvent = async (
	calendar,
	calendarId,
	page,
	colorId = 5
) => {
	// Stop execution if the page already exists in the calendar based off the database record
	const existingPageEvent = await PageEvent.findOne({
		$or : [
			{ pageId : page.id },
			{ title : page.name }
		]
	});
	if (existingPageEvent) {
		throw new Error(`PageEvent already exists in database for page ${page.id}`);
	}

	const {
		id,
		name,
		date: {
			end,
			start
		},
		progress: { id: progressId },
	} = page;

	const event = calendar.events.insert(
		{
			calendarId,
			requestBody : {
				colorId,
				end       : { dateTime : end },
				reminders : { useDefault : true },
				start     : { dateTime : start },

				// We need to make sure name starts with what we want, since that's the
				// filter for `listDikataEvents` helper
				summary : isDikataEvent(name) ? name : `${process.env.GOOGLE_CALENDAR_EVENTS_FILTER} ${name}`,
			},
			sendUpdates : "all",
		}
	);

	return await event.then(({ data }) => mapPageEvent(
		id,
		data.id,
		progressId,
		name,
		{
			end,
			start
		},
		data.status
	)).catch(err => console.error(err));
};

export default insertPageToEvent;