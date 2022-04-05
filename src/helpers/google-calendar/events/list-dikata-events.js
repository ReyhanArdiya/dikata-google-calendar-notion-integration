import getNextMonth from "../../dates/get-next-month.js";
import { listEventsByTimeRange } from "./list-events.js";

/**
 * Lists all Dikata events whose title/summary starts with "Dikata:" from today up
 * to next month.
 *
 * @param {import("googleapis").calendar_v3.Calendar} calendar
 *
 * @param {string} calendarId
 */
const listDikataEvents = async (calendar, calendarId) => {
	const { nextMonthEnd, nextMonthStart } = getNextMonth();

	const { data : { items } } = await listEventsByTimeRange(
		calendar,
		calendarId,
		nextMonthStart,
		nextMonthEnd,
	);

	/*
        CMT the reason I don't use google calendar's "q" parameter is because
        I only want to search "Dikata:" in the summary only, not in other fields.
    */
	// Filter events whose summary starts with "Dikata:"
	return items.filter(({ summary }) => /^Dikata:\s?.*$/i.test(summary));
};

export default listDikataEvents;