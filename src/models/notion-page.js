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
			properties/*  : {
                    Type: { select: { name: type } },
                    Progress: { select: { name: progress } },
                    Date: { date },
                    Summary: { "rich_text": [ { "plain_text": summary } ] },
                    Name: { title: [ { "plain_text": name } ] }
                }, */,
			url
		} = page;

		this.date = properties?.Date?.date || null;
		this.id = id;
		this.name = properties?.Name?.title?.[0]?.plain_text || null;
		this.progress = properties?.Progress?.select?.name || null;
		this.summary = properties?.Summary?.rich_text?.[0]?.plain_text || null;
		this.type = properties?.Type?.select?.name || null;
		this.url = url;
	}
}

export default NotionPage;