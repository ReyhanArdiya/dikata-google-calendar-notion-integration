import PageEvent from "../../../models/page-event.js";

/**
 * Deletes both `NotionPage` and google calendar `event` in {@link notion}
 * and {@link calendar} respectively based on a `PageEvent` document. Then, deletes
 * the `PageEvent` document and returns it.
 *
 * @param {import("googleapis").calendar_v3.Calendar} calendar
 *
 * @param {string} calendarId
 *
 * @param {import("@notionhq/client").Client} notion
 *
 * @param {{
 * _id?: string,
 * eventId?: string,
 * pageId?: string,
 * title?: string
 * }} PageEventDoc A {@link PageEvent} document.
 */
const deleteUsingPageEvent = async (
	calendar,
	calendarId,
	notion,
	{ _id = "", eventId = "", pageId = "", title = "" }
) => {
	// Get PageEvent
	const existingPageEvent = await PageEvent.findOne({
		$or : [
			{ eventId },
			{ title },
			{ _id },
			{ pageId }
		]
	});

	// Throw if it doesn't exist
	if (!existingPageEvent) {
		throw new Error(`No PageEvent found for ${_id}`);
	}

	// Delete google calendar event
	await calendar.events.delete({
		calendarId,
		eventId     : existingPageEvent.eventId,
		sendUpdates : "all"
	});

	// Delete notion page
	await notion.pages.update({
		archived  : true,
		"page_id" : existingPageEvent.pageId
	});

	// Delete PageEvent and return it
	return await PageEvent.findByIdAndDelete(_id);
};

export default deleteUsingPageEvent;