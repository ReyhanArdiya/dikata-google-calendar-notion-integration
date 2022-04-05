import { createRFC3339 } from "./RFC3339.js";

/**
 * Returns the `nextMonthStart` and `nextMonthEnd` starting from today's date.
 *
 * @param {boolean} RFC3339 Get the RFC3339 version if true, else return the date object version.
 *
 * @returns {{nextMonthStart: string | Date, nextMonthEnd: string | Date}}
 */
const getNextMonth = (RFC3339 = true) => {
	// Next month start is technically today's time
	const nextMonthStart = new Date();

	// Next month end
	const nextMonthEnd = new Date(
		nextMonthStart.getFullYear(),
		// Next month end month is just +1 of next month start's month
		nextMonthStart.getMonth() + 1,
		nextMonthStart.getDate(),
		nextMonthStart.getHours(),
		nextMonthStart.getMinutes(),
		nextMonthStart.getSeconds()
	);

	if (!RFC3339) {
		return {
			nextMonthEnd,
			nextMonthStart
		};
	}

	const WIBTimeZone = "+07:00";
	// The months below neeeds to be incremented by 1 since Date's month starts at 0
	// Derive RFC3339 of nextMonthStart
	const nextMonthStartRFC3339 = createRFC3339(
		nextMonthStart.getFullYear(),
		nextMonthStart.getMonth() + 1,
		nextMonthStart.getDate(),
		nextMonthStart.getHours(),
		nextMonthStart.getMinutes(),
		nextMonthStart.getSeconds(),
		WIBTimeZone
	);

	// Derive RFC3339 of nextMonthEnd
	const nextMonthEndRFC3339 = createRFC3339(
		nextMonthEnd.getFullYear(),
		nextMonthEnd.getMonth() + 1,
		nextMonthEnd.getDate(),
		nextMonthEnd.getHours(),
		nextMonthEnd.getMinutes(),
		nextMonthEnd.getSeconds(),
		WIBTimeZone
	);

	return {
		nextMonthEnd   : nextMonthEndRFC3339,
		nextMonthStart : nextMonthStartRFC3339,
	};
};

export default getNextMonth;
