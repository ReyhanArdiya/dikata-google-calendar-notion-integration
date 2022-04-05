/*
CMT
Use this module to get your access and refresh tokens. Steps:
1. Launch this script through node
2. Go the the URL in your browser and authorize through it
3. Your token will be available in your .env if you are not in production or through
   the console which you can then just copy and paste the tokens into your enviroment manager.

I know this is not intuitive, but this is so far the only way I can get access
to these tokens for the purpose of this app since google calendar only supports
OAuth2 :(.

But you should only need to do this once since the refresh token will be used prepetually
by this app later.
*/

/*
CMT btw if we ever want to do this again, we don't have to use express or passport
since the googleapis module already has its own way of doing authentication.
But even then if I want to use an OAuth2 client i would still need to open up the
consent page :/
*/

if (process.env.NODE_ENV !== "production") {
	await import("dotenv/config");
}
import GoogleStrategy from "passport-google-oauth2";
import express from "express";
import { promises as fspromises } from "fs";
import passport from "passport";

const port = process.env.PORT;
const app = express();
app.use(passport.initialize());

const createGoogleStrategy = () => {
	const authGoogleStrategy = async (
		_request,
		accessToken,
		refreshToken,
		_profile,
		done
	) => {
		try {
			console.log(`Access token: ${accessToken} --- Refresh token: ${refreshToken}`);
			if (process.env.NODE_ENV !== "production") {
				await fspromises.appendFile(process.env.PATH_TO_ENV, `\nGOOGLE_CALENDAR_OAUTH2_ACCESS_TOKEN = ${accessToken}`);
				await fspromises.appendFile(process.env.PATH_TO_ENV, `\nGOOGLE_CALENDAR_OAUTH2_REFRESH_TOKEN = ${refreshToken}`);
			}
			done(null, null);
		} catch (err) {
			done(err);
		}
	};

	return new GoogleStrategy(
		{
			callbackURL       : process.env.GOOGLE_CALENDAR_OAUTH2_CB,
			clientID          : process.env.GOOGLE_CALENDAR_OAUTH2_CLIENT_ID,
			// eslint-disable-next-line max-len
			clientSecret      : process.env.GOOGLE_CALENDAR_OAUTH2_CLIENT_SECRET,
			passReqToCallback : true
		},
		authGoogleStrategy
	);
};

passport.use(createGoogleStrategy());

app.get(process.env.GOOGLE_CALENDAR_OAUTH2_PATH, passport.authenticate(
	"google",
	{
		accessType : "offline",
		prompt     : "consent",
		scope      : [ "email", "profile", "https://www.googleapis.com/auth/calendar" ],
	}
));

app.get(process.env.GOOGLE_CALENDAR_OAUTH2_CB, passport.authenticate(
	"google",
	{ successRedirect : "/" }
));

app.listen(port, () => console.log(`Go to yourdomain or http://localhost:${port}${process.env.GOOGLE_CALENDAR_OAUTH2_PATH} to get the access and refresh token through .env or console.log`));


