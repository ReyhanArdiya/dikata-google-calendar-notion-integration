import "dotenv/config";
import { Client } from "@notionhq/client";
import GoogleDikataEventsWatcher from "./controllers/watchers/google-dikata-events-watcher.js";
import NotionDikataAgendaWatcher from "./controllers/watchers/notion-dikata-agenda-watcher.js";
import checkGcalEnvTokens from "./helpers/google-calendar/tokens/check-gcal-env-tokens.js";
import getOAuth2Client from "./helpers/google-calendar/tokens/get-oauth2client.js";
import { google } from "googleapis";
import mongoose from "mongoose";

// Only do this if we don't have the tokens in our environment yet
if (!checkGcalEnvTokens()) {
	// Get the OAuth2 tokens for google calendar, requires a browser to be opened
	await import("./helpers/google-calendar/tokens/get-token.js");
}

// Connect to mongo
const mongoDatabase = process.env.MONGODB;
try {
	await mongoose.connect(mongoDatabase);
	console.log(`Connected to ${mongoDatabase}!🍃`);
} catch (err) {
	console.log(`Error! Can't connect to ${mongoDatabase}!🍂`, err);
}

// Notion stuff
const notionClient = new Client(
	{ auth : process.env.NOTION_INTERNAL_INTEGRATION_TOKEN }
);
const databaseId = process.env.NOTION_AGENDA_DB_ID;

// Google calendar stuff
const googleClient = getOAuth2Client(
	process.env.GOOGLE_CALENDAR_OAUTH2_CLIENT_ID,
	process.env.GOOGLE_CALENDAR_OAUTH2_CLIENT_SECRET,
	process.env.GOOGLE_CALENDAR_OAUTH2_ACCESS_TOKEN,
	process.env.GOOGLE_CALENDAR_OAUTH2_REFRESH_TOKEN
);
const calendar = google.calendar({
	auth    : googleClient,
	version : "v3"
});
const calendarId = process.env.GOOGLE_CALENDAR_PRIMARY_CALENDARID;

// Start watching for notion dikata agenda changes
const notionDikataAgendaWatcher = new NotionDikataAgendaWatcher(
	notionClient,
	databaseId,
	calendar,
	calendarId,
	parseInt(process.env.NOTION_DIKATA_AGENDA_WATCHER_MS)
);
console.log(`notionDikataAgendaWatcher is ${notionDikataAgendaWatcher.isRunning ? "running" : "not running"} every ${notionDikataAgendaWatcher.ms}ms!`);

// Start watching for google calendar dikata events changes
const googleDikatEventsaWatcher = new GoogleDikataEventsWatcher(
	calendar,
	calendarId,
	notionClient,
	databaseId,
	parseInt(process.env.GOOGLE_DIKATA_EVENTS_WATCHER_MS)
);
console.log(`googleDikatEventsaWatcher is ${googleDikatEventsaWatcher.isRunning ? "running" : "not running"} every ${googleDikatEventsaWatcher.ms}ms!`);
