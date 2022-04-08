import { getPastToNextMonth } from "../../dates/date-range.js";
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
	const { pastMonthStart, nextMonthEnd } = getPastToNextMonth();

	const { data } = await listEventsByTimeRange(
		calendar,
		calendarId,
		pastMonthStart,
		nextMonthEnd,
		"Dikata:"
	);

	return data;
};

export default listDikataEvents;