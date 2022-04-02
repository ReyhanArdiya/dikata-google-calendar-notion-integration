if (process.env.NODE_ENV !== "production") {
	await import("dotenv/config");
}

/**
 * Checks if "GOOGLE_CALENDAR_OAUTH2_ACCESS_TOKEN" and "GOOGLE_CALENDAR_OAUTH2_REFRESH_TOKEN" are present
 * as environment variables.
 *
 * @returns {boolean}
 */
const checkGcalEnvTokens = () => {
	return !!(process.env.GOOGLE_CALENDAR_OAUTH2_ACCESS_TOKEN &&
		process.env.GOOGLE_CALENDAR_OAUTH2_REFRESH_TOKEN);
};

export default checkGcalEnvTokens;


