// eslint-disable-next-line no-unused-vars
import NotionPage from "../models/notion-page.js";
import PageEvent from "../models/page-event.js";
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
	colorId = 6
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
		}
	} = page;

	const event = calendar.events.insert(
		{
			calendarId,
			requestBody : {
				colorId,
				end       : { dateTime : end },
				// id      : id,
				reminders : { useDefault : true },
				start     : { dateTime : start },
				summary   : name,
			},
			sendUpdates : "all",
		}
	);

	return await event.then(({ data }) => mapPageEvent(
		id,
		data.id,
		name,
		{
			end,
			start
		}
	)).catch(err => console.error(err));
};

export default insertPageToEvent;