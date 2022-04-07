/* eslint-disable brace-style */
// eslint-disable-next-line no-unused-vars
import NotionPage from "../../models/notion-page.js";
import PageEvent from "../../models/page-event.js";

/**
 * This helper will tell you which {@link NotionPage}s are `deleted`, `new` and
 * `updated` inside of {@link notionPages} when compared with the
 * {@link PageEvent} collection in the database.
 *
 * @param {NotionPage[]} notionPages
 *
 * @param {boolean} verboseUpdates
 * `true` to append more verbose updates information in the returned object `updated`
 * property, `false` to fill it with an array of {@link NotionPage}s that was updated;
 * default is false.
 *
 * @returns {Promise<{
 *    deleted   : ?{
 *        date      : {
 *            end: string,
 *            start: string
 *        },
 *        eventId   : string,
 *        pageId    : string,
 *        title     : string,
 *    }[],
 *    new       : ?NotionPage[],
 *    updated   : NotionPage[] | {
 *        _id: import("mongoose").ObjectId,
 *        eventId: string,
 *        pageId: string,
 *        title?: {
 *            new: string,
 *            old: string
 *        },
 *        date?: {
 *            start?: {
 *                new: string,
 *                old: string
 *            },
 *            end?: {
 *                new: string,
 *                old: string
 *            }
 *        }
 *    }[] | null
 * }>} An object containing information about `deleted`, `new` and `updated` pages
 */
const detectPagesDifferences = async (notionPages, verboseUpdates = false) => {
	const differences = {
		deleted : null,
		new     : null,
		updated : null
	};

	// We get all the pageEvents for filtering later
	const pageEvents = await PageEvent.find({});

	// We use hash table as an index to avoid O(N^2) later in the filters
	const pageEventsIndex = pageEvents.reduce(
		(obj, { pageId, title }) => {
			obj[pageId] = title;
			return obj;
		},
		{}
	);

	// For notionPages, we'll store the whole NotionPage object so we can check
	// if it exists and instantly retrieve the object later when checking for updates
	const notionPagesIndex = notionPages.reduce(
		(obj, page) => {
			obj[page.id] = page;
			return obj;
		},
		{}
	);

	// Deleted is when we don't have the page in notionPages but have it in pageEvents
	const deletedPages = pageEvents.filter(
		({ pageId }) => !notionPagesIndex[pageId]
	);
	differences.deleted = deletedPages.length ? deletedPages : null;

	// New is when we have the page in notionPages but not in pageEvents
	const newPages = notionPages.filter(
		({ id }) => !pageEventsIndex[id]
	);
	differences.new = newPages.length ? newPages : null;

	// Updated is when we have the page in notionPages and in pageEvents;
	// but either their title, date.start or date.end is different
	const updatedPages = [];

	// We'll loop through pageEvents and not notionPages since we need information
	// about the _id, eventId, old dates and old title
	pageEvents.forEach(
		({ _id, date: { start, end }, eventId, pageId, title }) => {
			const notionPage = notionPagesIndex[pageId];

			// If the page doesn't exist in notionPages, it means that it is
			// not available in both arrays; so we return early
			if (!notionPage) {
				return;
			}

			// If it passed that check, it means that the page is available in both
			// arrays and we can compare their title & dates
			const isTitleDiff = title !== notionPage.name;
			const isDateStartDiff = start !== notionPage.date.start;
			const isDateEndDiff = end !== notionPage.date.end;

			// If any property is different, it means that the page was updated
			if (isTitleDiff || isDateStartDiff || isDateEndDiff) {
				if (verboseUpdates) {
					// We store the updates here first and give it the page's base information
					const pageUpdates = {
						_id,
						eventId,
						pageId
					};

					// If the difference was in the title, we put that information in
					if (isTitleDiff) {
						pageUpdates.title = {
							new : notionPage.name,
							old : title
						};
					}

					// If one of the date is updated, we'll put those information in
					if (isDateStartDiff || isDateEndDiff) {
						const date = {};

						// Put the start date difference if the difference was in the start date
						if (isDateStartDiff) {
							date.start = {
								new : notionPage.date.start,
								old : start
							};
						}

						// Put the end date difference if the difference was in the end date
						if (isDateEndDiff) {
							date.end = {
								new : notionPage.date.end,
								old : end
							};
						}

						// We add the date differences in pageUpdates
						pageUpdates.date = date;
					}

					// We push this page's updates information into the array
					updatedPages.push(pageUpdates);
				} else {
					// If verboseUpdates is false, we just push the updated page into the array
					updatedPages.push(notionPage);
				}
			}
		}
	);
	differences.updated = updatedPages.length ? updatedPages : null;

	return differences;
};

export default detectPagesDifferences;


