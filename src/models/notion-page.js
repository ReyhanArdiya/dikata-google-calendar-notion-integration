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


		this.date = notionDate ?
			{
				end   : notionDate.end ? notionDate.end : notionDate.start,
				start : notionDate.start,
			} :
			null;
		this.id = id;
		this.name = properties?.Name?.title?.[0]?.plain_text || null;
		this.progress = properties?.Progress?.select?.name || null;
		this.summary = properties?.Summary?.rich_text?.[0]?.plain_text || null;
		this.type = properties?.Type?.select?.name || null;
		this.url = url;
	}
}

export default NotionPage;