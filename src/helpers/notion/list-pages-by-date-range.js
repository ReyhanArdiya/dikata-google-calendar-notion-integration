import NotionPage from "../../models/notion-page.js";
import { validateRFC3339 } from "../dates/RFC3339.js";

/**
 * List pages whose date property's start time is on or between {@link start} and {@link end}.
 * This helper will also validate {@link start} and {@link end} to make sure they are RFC3339 formatted.
 *
 * @param {import("@notionhq/client").Client} notion
 *
 * @param {string} databaseId
 *
 * @param {string} start A RFC3339 timestamp WITH time zone offset, e.g. "YYYY-MM-DDTHH:MM:SS+00:00" or "YYYY-MM-DDTHH:MM:SSZ".
 *
 * @param {string} end A RFC3339 timestamp WITH time zone offset, e.g. "YYYY-MM-DDTHH:MM:SS+00:00" or "YYYY-MM-DDTHH:MM:SSZ".
 *
 */
const listPagesByDateRange = async (notion, databaseId, start, end) => {
	const errorChecks = {
		TZOpt    : true,
		throwErr : true
	};
	validateRFC3339(start, errorChecks);
	validateRFC3339(end, errorChecks);

	const { results } = await notion.databases.query({
		"database_id" : databaseId,
		filter        : {
			date : {
				"on_or_after"  : start,
				"on_or_before" : end
			},
			property : "Date"
		}
	});

	return results.map(page => new NotionPage(page));
};

export default listPagesByDateRange;