import checkGcalEnvTokens from "./helpers/google-calendar/check-gcal-env-tokens.js";

if (process.env.NODE_ENV !== "production") {
	(await import("dotenv")).config();
}

if (!checkGcalEnvTokens()) {
	await import("./helpers/google-calendar/get-token.js");
}

