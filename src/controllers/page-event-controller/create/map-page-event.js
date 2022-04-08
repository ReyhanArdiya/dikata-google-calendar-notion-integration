import PageEvent from "../../../models/page-event.js";

/**
 * Maps a `NotionPage` id and a gcal event id with their title and date start/end
 * to a `PageEvent` document and saves it to the database.
 *
 * @param {string} pageId
 *
 * @param {string} eventId
 *
 * @param {string} title
 *
 * @param {{start: string, end: string}} date Start & End date string in RFC3339 format
 *
 * @param {"cancelled" | "confirmed" | "tentative"} status
 * The google `event` status field.
 */
const mapPageEvent = async (pageId, eventId, title, { start, end }, status) => {
	const pageEvent = new PageEvent({
		date : {
			end,
			start
		},
		eventId,
		pageId,
		status,
		title
	});

	return await pageEvent.save();
};

export default mapPageEvent;