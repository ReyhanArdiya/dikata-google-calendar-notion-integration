import { createRFC3339 } from "./RFC3339.js";

/**
 * Returns the `pastMonthStart` and `pastMonthEnd` starting from today's date.
 *
 * @param {boolean} RFC3339 Get the RFC3339 version if true, else return the date object version.
 *
 * @returns {{pastMonthStart: string | Date, pastMonthEnd: string | Date}}
 */
const getPastMonth = (RFC3339 = true) => {
	// Past month end is technically today's time
	const pastMonthEnd = new Date();

	// Past month start
	const pastMonthStart = new Date(
		pastMonthEnd.getFullYear(),
		// Past month start month is just -1 of past month end's month
		pastMonthEnd.getMonth() - 1,
		pastMonthEnd.getDate(),
		pastMonthEnd.getHours(),
		pastMonthEnd.getMinutes(),
		pastMonthEnd.getSeconds()
	);

	if (!RFC3339) {
		return {
			pastMonthEnd,
			pastMonthStart
		};
	}

	const WIBTimeZone = "+07:00";
	// The months below neeeds to be incremented by 1 since Date's month starts at 0
	// Derive RFC3339 of pastMonthStart
	const pastMonthStartRFC3339 = createRFC3339(
		pastMonthStart.getFullYear(),
		pastMonthStart.getMonth() + 1,
		pastMonthStart.getDate(),
		pastMonthStart.getHours(),
		pastMonthStart.getMinutes(),
		pastMonthStart.getSeconds(),
		WIBTimeZone
	);

	// Derive RFC3339 of pastMonthEnd
	const pastMonthEndRFC3339 = createRFC3339(
		pastMonthEnd.getFullYear(),
		pastMonthEnd.getMonth() + 1,
		pastMonthEnd.getDate(),
		pastMonthEnd.getHours(),
		pastMonthEnd.getMinutes(),
		pastMonthEnd.getSeconds(),
		WIBTimeZone
	);

	return {
		pastMonthEnd   : pastMonthEndRFC3339,
		pastMonthStart : pastMonthStartRFC3339,
	};
};


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

/**
 * Returns the start of past month and the end of next month
 *
 * @param {boolean} RFC3339
 */
const getPastToNextMonth = (RFC3339 = true) => {
	const { pastMonthStart } = getPastMonth(RFC3339);
	const { nextMonthEnd } = getNextMonth(RFC3339);

	return {
		nextMonthEnd,
		pastMonthStart,
	};
};

const dateRange = {
	getNextMonth,
	getPastMonth,
	getPastToNextMonth,
};

export default dateRange;