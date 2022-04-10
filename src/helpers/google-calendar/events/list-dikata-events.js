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
		`${process.env.GOOGLE_CALENDAR_EVENTS_FILTER}`
	);

	return data;
};

export default listDikataEvents;