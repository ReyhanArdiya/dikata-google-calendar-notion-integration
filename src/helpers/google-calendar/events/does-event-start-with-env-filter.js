/**
 * Detects if an event summary starts with the env variable GOOGLE_CALENDAR_EVENTS_FILTER
 * value case-insensitive.
 *
 * @param {string} str
 *
 */
const doesEventStartWithEnvFilter = str => new RegExp(`^${process.env.GOOGLE_CALENDAR_EVENTS_FILTER}`, "i").test(str);

export default doesEventStartWithEnvFilter;