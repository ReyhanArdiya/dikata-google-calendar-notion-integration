// eslint-disable-next-line no-unused-vars
import NotionPage from "../../models/notion-page.js";
import Watcher from "./watcher.js";
import detectPagesDifferences from "../../helpers/notion/detect-pages-differences.js";
import { getPastToNextMonth } from "../../helpers/dates/date-range.js";
import listPagesByDateRange from "../../helpers/notion/list-pages-by-date-range.js";
import pageEventController from "../page-event-controller/index.js";

/**
 * {@link NotionWatcher}'s watchingFn will be listing the pages from past month
 * up to next month and then detecting the differences using {@link detectPagesDifferences}
 * and returning it to be processed by {@link NotionWatcherAsyncCb}.
 *
 * @param {import("@notionhq/client").Client} notion
 *
 * @param {string} databaseId
 *
 */
const NotionWatcherWatchingFn = async (notion, databaseId) => {
	const { pastMonthStart, nextMonthEnd } = getPastToNextMonth();

	// List pages from past month up to next month. Since we are using date
	// range it means that it won't list pages whose "Date" property is not set
	const notionPages = await listPagesByDateRange(
		notion,
		databaseId,
		pastMonthStart,
		nextMonthEnd
	);

	// Detect the differences and pass it to NotionWatcherAsyncCb
	return await detectPagesDifferences(notionPages);
};

/**
 * {@link NotionWatcher}'s asyncCb will be deleting, inserting or updating
 * google {@link calendar} events based on the {@link NotionPage} differences that was passed by
 * {@link NotionWatcherWatchingFn}.
 *
 * @param {import("googleapis").calendar_v3.Calendar} calendar
 *
 * @param {string} calendarId
 *
 */
const NotionWatcherAsyncCb = (calendar, calendarId) => async ({
	deleted: deletedPages,
	new: newPages,
	updated: updatedPages
}) => {
	// CMT notice that we don't use async/await here since we don't
	// need to await the previous process (e.g. the previous page doesn't need to
	// be deleted first before the next one can be deleted). So, we need to use
	// .catch to prevent our app from breaking.

	// DBG for development purposes
	if (process.env.NODE_ENV !== "production") {
		console.log("=============================================");
		console.log("deletedPages:", deletedPages);
		console.log("newPages:", newPages);
		console.log("updatedPages:", updatedPages);
		console.log("=============================================");
	}

	// Delete relevant events if there were any deleted page
	if (deletedPages) {
		deletedPages.forEach(
			deletedPage => pageEventController.delete.deleteEventUsingPage(
				calendar,
				calendarId,
				{
					id   : deletedPage.pageId,
					name : deletedPage.title
				}
			).catch(err => console.error(err))
		);
	}

	// Insert relevant events if there were any new page
	if (newPages) {
		newPages.forEach(
			newPage => pageEventController.create.insertPageToEvent(
				calendar,
				calendarId,
				newPage
			).catch(err => console.error(err))
		);
	}

	// Update relevant events if there were any updated page
	if (updatedPages) {
		updatedPages.forEach(
			updatedPage => pageEventController.update.updatePageToEvent(
				calendar,
				calendarId,
				updatedPage
			).catch(err => console.error(err))
		);
	}
};

const NotionWatcherCatchingFn = err => console.error(err);

/**
 * Watches for changes in the `notion` database and then `update`, `insert` and
 * `delete` google `calendar` `event`s accordingly. When this class is instantiated,
 * it will "scan" the database for changes once before starting its interval.
 */
class NotionWatcher extends Watcher {
	/**
	 *
	 * @param {import("@notionhq/client").Client} notion
	 *
	 * @param {string} databaseId
	 *
	 * @param {import("googleapis").calendar_v3.Calendar} calendar
	 *
	 * @param {string} calendarId
	 *
	 * @param {number} ms
	 */
	constructor(notion, databaseId, calendar, calendarId, ms) {
		super(
			NotionWatcherWatchingFn.bind(null, notion, databaseId),
			NotionWatcherAsyncCb(calendar, calendarId),
			NotionWatcherCatchingFn,
			ms
		);

		this.activate(true);
	}
}

export default NotionWatcher;


