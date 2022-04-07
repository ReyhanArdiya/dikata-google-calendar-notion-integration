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
			// Format start and end date to RFC3339
			let start = notionDate.start.split(".000").join("");
			let end = notionDate.end ? notionDate.end.split(".000").join("") : start;

			// There could be a possibility that our page doesn't include time,
			// but google calendar needs time so we set a default in that case
			if (!start.includes("T")) {
				start = `${start}T07:00:00+07.00`;
			}
			if (!end.includes("T")) {
				end = `${end}T08:00:00+07.00`;
			}

			date = {
				end,
				start
			};
		}

		this.date = date;
		this.id = id;
		this.name = properties?.Name?.title?.[0]?.plain_text || null;
		this.progress = properties?.Progress?.select || null;
		this.summary = properties?.Summary?.rich_text?.[0]?.plain_text || null;
		this.type = properties?.Type?.select || null;
		this.url = url;
	}
}

export default NotionPage;