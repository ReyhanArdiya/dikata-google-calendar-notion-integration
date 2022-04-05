/**
 * Formats a notion page object JSON data into another JSON format.
 */
class NotionPage {
	/**
	 * Formats a notion page object JSON data into another JSON format.
	 *
	 * @param {any} page A notion page object JSON data.
	 */
	constructor(page) {
		const {
			id,
			properties,
			properties: { Date: { date: notionDate } },
			url
		} = page;

		let date = null;

		if (notionDate) {
			// Format start and end to RFC3339
			const start = notionDate.start.split(".000").join("");
			const end = notionDate.end ? notionDate.end.split(".000").join("") : start;

			date = {
				end,
				start
			};
		}

		this.date = date;
		this.id = id;
		this.name = properties?.Name?.title?.[0]?.plain_text || null;
		this.progress = properties?.Progress?.select?.name || null;
		this.summary = properties?.Summary?.rich_text?.[0]?.plain_text || null;
		this.type = properties?.Type?.select?.name || null;
		this.url = url;
	}
}

export default NotionPage;