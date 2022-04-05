import checkGcalEnvTokens from "./helpers/google-calendar/tokens/check-gcal-env-tokens.js";
import mongoose from "mongoose";

if (process.env.NODE_ENV !== "production") {
	(await import("dotenv")).config();
}

// Only do this if we don't have the tokens in our environment yet
if (!checkGcalEnvTokens()) {
	await import("./helpers/google-calendar/tokens/get-token.js");
}

const mongoDatabase = process.env.MONGODB;
try {
	await mongoose.connect(mongoDatabase);
	console.log(`Connected to ${mongoDatabase}!🍃`);
} catch (err) {
	console.log(`Error! Can't connect to ${mongoDatabase}!🍂`, err);
}
