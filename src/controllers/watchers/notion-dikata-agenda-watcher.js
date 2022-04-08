// eslint-disable-next-line no-unused-vars
import NotionPage from "../../models/notion-page.js";
import Watcher from "./watcher.js";
import detectPagesDifferences from "../../helpers/notion/detect-pages-differences.js";
import { getPastToNextMonth } from "../../helpers/dates/date-range.js";
import listPagesByDateRange from "../../helpers/notion/list-pages-by-date-range.js";
import pageEventController from "../page-event-controller/index.js";

/**
 * Watches for changes in the `notion` database and then `update`, `insert` and
 * `delete` google `calendar` `event`s accordingly. When this class is instantiated,
 * it will "scan" the database for changes once before starting its interval.
 */
class NotionDikataAgendaWatcher extends Watcher {
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
		/**
		 * {@link NotionDikataAgendaWatcher}'s watchingFn will be listing the pages from past month
		 * up to next month and then detecting the differences using {@link detectPagesDifferences}
		 * and returning it to be processed by {@link NotionWatcherAsyncCb}.
		 */
		const NotionWatcherWatchingFn = async () => {
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

		// eslint-disable-next-line jsdoc/require-param
		/**
		 * {@link NotionDikataAgendaWatcher}'s asyncCb will be deleting, inserting or updating
		 * google {@link calendar} events based on the {@link NotionPage} differences that was passed by
		 * {@link NotionWatcherWatchingFn}.
		 */
		const NotionWatcherAsyncCb = async ({
			deleted: deletedPages,
			new: newPages,
			updated: updatedPages
		}) => {
			// CMT notice that we don't use async/await here since we don't
			// need to await the previous process (e.g. the previous page doesn't need to
			// be deleted first before the next one can be deleted). So, we need to use
			// .catch to prevent our app from breaking.

			// Delete relevant events if there were any deleted page
			if (deletedPages) {
				deletedPages.forEach(deletedPage => {
					pageEventController.delete.deleteEventUsingPage(
						calendar,
						calendarId,
						{
							id   : deletedPage.pageId,
							name : deletedPage.title
						}
					).catch(err => console.error(err));
				});
			}

			// Insert relevant events if there were any new page
			if (newPages) {
				newPages.forEach(
					newPage => {
						// Prevent creating empty events when user provides empty page name
						if (newPage.name) {
							pageEventController.create.insertPageToEvent(
								calendar,
								calendarId,
								newPage
							).catch(err => console.error(err));
						}
					}
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

		super(
			NotionWatcherWatchingFn,
			NotionWatcherAsyncCb,
			NotionWatcherCatchingFn,
			ms
		);

		this.activate(true);
	}
}

export default NotionDikataAgendaWatcher;


