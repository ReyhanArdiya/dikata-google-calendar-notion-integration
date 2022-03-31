/**
 * List all pages in the database using a specific JSON format.
 *
 * @param {import("@notionhq/client").Client} notion
 *
 * @param {string} databaseId
 *
 * @returns {Promise<any[]>}
 */
const listPages = async (notion, databaseId) => {
	const { results } = await notion.databases.query({ "database_id" : databaseId });

	return results.map(page => {
		const {
			id,
			properties : {
				Type: { select: { name: type } },
				Progress: { select: { name: progress } },
				Date: { date },
				Summary: { "rich_text": [ { "plain_text": summary } ] },
				Name: { title: [ { "plain_text": name } ] }
			},
			url
		} = page;

		return {
			date,
			id,
			name,
			progress,
			summary,
			type,
			url
		};
	});
};

export default listPages;