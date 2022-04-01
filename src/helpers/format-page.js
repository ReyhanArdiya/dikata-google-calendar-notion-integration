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
};

export default formatPage;