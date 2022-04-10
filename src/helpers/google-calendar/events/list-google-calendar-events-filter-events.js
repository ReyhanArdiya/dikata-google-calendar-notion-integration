import { getPastToNextMonth } from "../../dates/date-range.js";
import { listEventsByTimeRange } from "./list-events.js";

/**
 * Lists all events whose title/summary contains a string that matches
 * `process.env.GOOGLE_CALENDAR_EVENTS_FILTER` from past month
 * to next month.
 *
 * @param {import("googleapis").calendar_v3.Calendar} calendar
 *
 * @param {string} calendarId
 */
const listGoogleCalendarEventsFilterEvents = async (calendar, calendarId) => {
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

export default listGoogleCalendarEventsFilterEvents;