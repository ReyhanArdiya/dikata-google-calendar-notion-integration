/**
 * Detects if {@link str} is a dikata event. A dikata event
 * is when the event title/summary starts with "Dikata" case insensitive.
 *
 * @param {string} str
 *
 */
const isDikataEvent = str => /^Dikata/i.test(str);

export default isDikataEvent;