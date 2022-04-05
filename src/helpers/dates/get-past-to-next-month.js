import getNextMonth from "./get-next-month.js";
import getPastMonth from "./get-past-month.js";

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

export default getPastToNextMonth;