import formatPage from "./format-page.js";

/**
 * Find pages based on their title in the notion database.
 *
 * @param {import("@notionhq/client").Client} notion
 *
 * @param {string} databaseId
 *
 * @param {string} title
 *
 * @returns {Promise<any>}
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
 * @returns {Promise<any>}
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
 * @returns {Promise<any>}
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
 * @param {string} date A date string in the format of "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM:SS".
 *
 * @returns {Promise<any>}
 */
export const findPagesByDateOnBefore = async (notion, databaseId, date) => {
	// Year must be 4 characters and there is no limit
	const YY = "[0-9]{4}";
	// Month must be from 00-12
	const MM = "(0[1-9]|1[0-2])";
	// Date must be from 01-31
	const DD = "(0[1-9]|[12][0-9]|3[01])";
	// Hour must be from 00-23
	const HH = "([0-1][0-9]|2[0-3])";
	// Minute must be from 00-59
	const MMinute = "([0-5][0-9])";
	// Second must be from 00-59
	const SS = "([0-5][0-9])";

	const dateFormat = new RegExp(`^${YY}-${MM}-${DD}(T${HH}:${MMinute}:${SS})?$`);
	if (!dateFormat.test(date)) {
		throw new Error("Invalid date! date must be formatted in \"YYYY-MM-DD\" or \"YYYY-MM-DDTHH:MM:SS\" and must not exceed each time's limit, e.g. HH can't be more than 23.");
	}

	const { results } = await notion.databases.query({
		"database_id" : databaseId,
		filter        : {
			date     : { "on_or_before" : date },
			property : "Date",
		}
	});

	return results.length ? results.map(formatPage) : null;
};
