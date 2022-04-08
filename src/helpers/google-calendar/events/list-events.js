import { validateRFC3339 } from "../../dates/RFC3339.js";

/**
 * List google {@link calendar} events from {@link timeMin} up to {@link timeMax}.
 * This helper will also validate {@link timeMin} and {@link timeMax} to make sure they are RFC3339 formatted.
 *
 * @param {import("googleapis").calendar_v3.Calendar} calendar
 *
 * @param {string} calendarId
 *
 * @param {string} timeMin A RFC3339 timestamp WITH time zone offset, e.g. "YYYY-MM-DDTHH:MM:SS+00:00" or "YYYY-MM-DDTHH:MM:SSZ".
 *
 * @param {string} timeMax A RFC3339 timestamp WITH time zone offset, e.g. "YYYY-MM-DDTHH:MM:SS+00:00" or "YYYY-MM-DDTHH:MM:SSZ".
 *
 * @param {string} q A query string to search events with.
 */
export const listEventsByTimeRange = async (
	calendar,
	calendarId,
	timeMin,
	timeMax,
	q = ""
) => {
	const errorChecks = {
		TZOpt    : false,
		throwErr : true
	};
	validateRFC3339(timeMin, errorChecks);
	validateRFC3339(timeMax, errorChecks);

	const res = await calendar.events.list({
		calendarId,
		q,
		showDeleted : true,
		timeMax,
		timeMin,
	});

	return res;
};