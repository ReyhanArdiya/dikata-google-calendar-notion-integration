import { createRFC3339 } from "./RFC3339.js";

/**
 * Returns the `pastMonthStart` and `pastMonthEnd` starting from today's date.
 *
 * @param {boolean} RFC3339 Get the RFC3339 version if true, else return the date object version.
 *
 * @returns {{pastMonthStart: string | Date, pastMonthEnd: string | Date}}
 */
const getPastMonth = (RFC3339 = true) => {
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth();
	const WIBTimeZone = "+07:00";

	const lastMonthStart = new Date(year, month, 1);
	const lastMonthEnd = new Date(year, month, 31);

	if (!RFC3339) {
		return {
			lastMonthEnd,
			lastMonthStart
		};
	}

	// Derive RFC3339 of lastMonthStart
	const lastMonthStartRFC3339 = createRFC3339(
		lastMonthStart.getFullYear(),
		lastMonthStart.getMonth(),
		lastMonthStart.getDate(),
		lastMonthStart.getHours(),
		lastMonthStart.getMinutes(),
		lastMonthStart.getSeconds(),
		WIBTimeZone
	);

	// Derive RFC3339 of lastMonthEnd
	const lastMonthEndRFC3339 = createRFC3339(
		lastMonthEnd.getFullYear(),
		lastMonthEnd.getMonth(),
		lastMonthEnd.getDate(),
		lastMonthEnd.getHours(),
		lastMonthEnd.getMinutes(),
		lastMonthEnd.getSeconds(),
		WIBTimeZone
	);

	return {
		lastMonthEnd   : lastMonthEndRFC3339,
		lastMonthStart : lastMonthStartRFC3339,
	};
};

export default getPastMonth;