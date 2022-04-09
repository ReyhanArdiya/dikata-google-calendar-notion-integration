import { createRFC3339 } from "./RFC3339.js";

/**
 * Gets the YYYY-MM-DDTHH-MM-SS from `rfc3999str`.
 *
 * @param {string} rfc3999str
 *
 */
const getTime = rfc3999str => rfc3999str.slice(0, 19);

/**
 * Compare now time with a start and end time.
 *
 * @param {string} start A start time in RFC3339 format which includes T.
 *
 * @param {string} end An end time in RFC3339 format which includes T.
 */
const compareNowWithRange = (start, end) => {
	const today = new Date();
	const todayTime = getTime(
		createRFC3339(
			today.getFullYear(),
			today.getMonth() + 1,
			today.getDate(),
			today.getHours(),
			today.getMinutes(),
			today.getSeconds()
		)
	);
	const startTime = getTime(start);
	const endTime = getTime(end);

	if (startTime <= todayTime && todayTime <= endTime) {
		// If todayTime is around start and end time, then it's in progress
		return "In Progress";
	}

	if (todayTime < startTime) {
		// If todayTime is before start time, then it's not yet
		return "Not Yet";
	}

	if (todayTime > endTime) {
		// If todayTime is after end time, then it's done
		return "Done";
	}
};

export default compareNowWithRange;