import { google } from "googleapis";

/**
 * Creates a new google oauth2client object and sets its credentials then returns it.
 *
 * @param {string} clientId
 *
 * @param {string} clientSecret
 *
 * @param {string} accessToken
 *
 * @param {string} refreshToken
 *
 */
const getOAuth2Client = (clientId, clientSecret, accessToken, refreshToken) => {
	const oauth2Client = new google.auth.OAuth2(
		clientId,
		clientSecret
	);

	oauth2Client.setCredentials({
		"access_token"  : accessToken,
		"refresh_token" : refreshToken,
	});

	return oauth2Client;
};

export default getOAuth2Client;