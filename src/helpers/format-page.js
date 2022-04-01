/**
 * Formats a notion page object JSON data into another JSON format.
 *
 * @param {any} page A notion page object JSON data.
 *
 * @returns {{
 *date: {start: string | null, end: string | null, time_zone: string | null},
 *id: string,
 * name: string,
 *progress: string,
 *summary: string,
 *type: string,
 *url: string
 *}}
 */
const formatPage = page => {
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

	return {
		date     : properties?.Date?.date || null,
		id,
		name     : properties?.Name?.title?.[0]?.plain_text || null,
		progress : properties?.Progress?.select?.name || null,
		summary  : properties?.Summary?.rich_text?.[0]?.plain_text || null,
		type     : properties?.Type?.select?.name || null,
		url
	};
};

export default formatPage;