import NotionPage from "../../models/notion-page.js";

/**
 * List all pages in the database using a specific JSON format.
 *
 * @param {import("@notionhq/client").Client} notion
 *
 * @param {string} databaseId
 *
 * @returns {Promise<NotionPage[]>}
 */
const listPages = async (notion, databaseId) => {
	const { results } = await notion.databases.query({ "database_id" : databaseId });

	return results.map(page => new NotionPage(page));
};

export default listPages;