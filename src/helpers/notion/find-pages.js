import formatPage from "./format-page.js";
import { validateRFC3339 } from "../dates/RFC3339.js";

/**
 * Find pages based on their title in the notion database.
 *
 * @param {import("@notionhq/client").Client} notion
 *
 * @param {string} databaseId
 *
 * @param {string} title
 *
 * @returns {Promise<any[]>}
 */
export const findPagesByTitle = async (notion, databaseId, title) => {
	const { results } = await notion.databases.query({
		"database_id" : databaseId,
		filter        : {
			property    : "Name",
			"rich_text" : { contains : title },
		},
	});

	return results.length ? results.map(formatPage) : null;
};

/**
 * Find pages based on their progress in the notion database.
 *
 * @param {import("@notionhq/client").Client} notion
 *
 * @param {string} databaseId
 *
 * @param {"Not Yet" | "In Progress" | "Done" | "Cancelled"} progress
 *
 * @returns {Promise<any[]>}
 */
export const findPagesByProgress = async (notion, databaseId, progress) => {
	const { results } = await notion.databases.query({
		"database_id" : databaseId,
		filter        : {
			property : "Progress",
			select   : { equals : progress },
		},
	});

	return results.length ? results.map(formatPage) : null;
};

/**
 * Find pages based on their type in the notion database.
 *
 * @param {import("@notionhq/client").Client} notion
 *
 * @param {string} databaseId
 *
 * @param {"Department Meeting" | "Organization Meeting"} type
 *
 * @returns {Promise<any[]>}
 */
export const findPagesByType = async (notion, databaseId, type) => {
	const { results } = await notion.databases.query({
		"database_id" : databaseId,
		filter        : {
			property : "Type",
			select   : { equals : type },
		},
	});

	return results.length ? results.map(formatPage) : null;
};

/**
 * Find pages based if their date property's start time is set to or before {@link date}.
 *
 * @param {import("@notionhq/client").Client} notion
 *
 * @param {string} databaseId
 *
 * @param {string} date A RFC3339 timestamp without time zone offset, e.g. "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM:SS".
 *
 * @returns {Promise<any[]>}
 */
export const findPagesByDateOnBefore = async (notion, databaseId, date) => {
	validateRFC3339(date, true);

	const { results } = await notion.databases.query({
		"database_id" : databaseId,
		filter        : {
			date     : { "on_or_before" : date },
			property : "Date",
		}
	});

	return results.length ? results.map(formatPage) : null;
};
