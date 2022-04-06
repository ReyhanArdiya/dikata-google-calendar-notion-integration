import PageEvent from "../models/page-event.js";
import { Progress } from "../models/selections-map.js";

/**
 * Updates a notion {@link NotionPage} in {@link notion} based on a google
 * calendar {@link event} object where the `NotionPage`'s `pageId` is acquired
 * by searching the `pageevents` collection using `event.id` or `event.summary`
 * as the `title` field. After updating the event in {@link notion}, the found
 * `PageEvent` document is updated, saved and returned.
 *
 * @param {import("@notionhq/client").Client} notion
 *
 * @param {import("googleapis").calendar_v3.Schema$Event} event
 *
 */
const updateEventToPage = async (
	notion,
	event
) => {
	// Destructure the event
	const {
		id: eventId,
		summary,
		start : { dateTime: start },
		end : { dateTime: end },
		status,
	} = event;

	const eventMemo = await PageEvent.findOne({
		$or : [
			{ eventId },
			{ title : summary }
		]
	});

	// Update event in notion
	const properties = {
		Date : {
			date : {
				end,
				start
			}
		},
		Name : { title : [ { text : { content : summary } } ] }
	};

	if (status === "cancelled") {
		properties.Progress = { select : { id : Progress["Cancelled"] } };
	}

	const updatedPage = await notion.pages.update({
		"page_id" : eventMemo.pageId,
		properties
	});

	// Update our memo in database
	eventMemo.date.end = end;
	eventMemo.date.start = start;
	eventMemo.eventId = eventId;
	eventMemo.pageId = updatedPage.id;
	eventMemo.title = summary;

	return await eventMemo.save();
};

export default updateEventToPage;