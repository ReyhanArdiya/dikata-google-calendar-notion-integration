import PageEvent from "../models/page-event.js";

/**
 * Deletes a google calendar `event` in {@link calendar}
 * based on a `NotionPage`s `id` OR `name` property, then deletes and returns
 * its `PageEvent` memo from collection.
 *
 * @param {import("googleapis").calendar_v3.Calendar} calendar
 *
 * @param {string} calendarId
 *
 * @param {{pageId: string, name: string}} filter
 */
const deleteEventUsingPage = async (
	calendar,
	calendarId,
	{ id: pageId = "", name: title = "" }
) => {
	const { _id, eventId } = await PageEvent.findOne({
		$or : [
			{ pageId },
			{ title }
		]
	});

	await calendar.events.delete({
		calendarId,
		eventId,
		sendUpdates : "all"
	});

	return await PageEvent.findByIdAndDelete(_id);
};

export default deleteEventUsingPage;