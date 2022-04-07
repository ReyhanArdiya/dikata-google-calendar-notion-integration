import PageEvent from "../../../models/page-event.js";
import { Progress } from "../../../models/selections-map.js";
import mapPageEvent from "./map-page-event.js";

/**
 * Inserts a {@link calendar} `event` to a {@link NotionPage} in the notion {@link databaseId}
 * and maps it to the database with {@link mapPageEvent} then returns a promise
 * which resolves into the `PageEvent` document.
 *
 * @param {{
 * notion: import("@notionhq/client").Client
 * databaseId: string
 * event: import("googleapis").calendar_v3.Schema$Event
 * notionSummary: string
 * progressId: string
 * typeId: string
 *}} params
 *
 */
const insertEventToPage = async ({
	notion,
	databaseId,
	event,
	notionSummary = "",
	progressId = Progress["Not Yet"],
	typeId = Progress["Department Meeting"]
}) => {
	// Stop execution if the page already exists in the calendar based off the database record
	const existingPageEvent = await PageEvent.findOne({
		$or : [
			{ eventId : event.id },
			{ title : event.summary }
		]
	});
	if (existingPageEvent) {
		throw new Error(`PageEvent already exists in database for event ${event.id}`);
	}

	const {
		summary,
		start: { dateTime :start },
		end: { dateTime : end }
	} = event;

	const page = await notion.pages.create(
		{
			parent     : { "database_id" : databaseId },
			properties : {
				Date : {
					date : {
						end,
						start
					}
				},
				Name     : { title : [ { text : { content : summary } } ] },
				Progress : { select : { id : progressId } },
				Summary  : { "rich_text" : [ { text : { content : notionSummary !== "" ? notionSummary : summary } } ] },
				Type     : { select : { id : typeId } },
			}
		}
	);

	return await mapPageEvent(
		page.id,
		event.id,
		summary,
		{
			end,
			start
		}
	);
};

export default insertEventToPage;