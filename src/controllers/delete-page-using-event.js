import PageEvent from "../models/page-event.js";

/**
 * Deletes a `NotionPage` in {@link notion} based on a google calendar `event`'s
 * `id` OR `summary` property, then deletes and returns its `PageEvent`
 * memo from collection.
 *
 * @param {import("@notionhq/client").Client} notion
 *
 * @param {{id: string, summary: string}} filter
 */
const deletePageUsingEvent = async (
	notion,
	{ id: eventId = "", summary: title = "" }
) => {
	const { _id, pageId } = await PageEvent.findOne({
		$or : [
			{ eventId },
			{ title }
		]
	});

	await notion.pages.update({
		archived  : true,
		"page_id" : pageId
	});

	return await PageEvent.findByIdAndDelete(_id);
};

export default deletePageUsingEvent;