/**
 * ~Detects if {@link str} is a dikata event. A dikata event
 * is when the event title/summary starts with "Dikata" case insensitive.~
 *
 * Detects if {@link str} starts with anything stored in
 * `process.env.GOOGLE_CALENDAR_EVENTS_FILTER` case insensitive.
 *
 * @param {string} str
 *
 */
const isDikataEvent = str => new RegExp(`^${process.env.GOOGLE_CALENDAR_EVENTS_FILTER}`, "i").test(str);

export default isDikataEvent;