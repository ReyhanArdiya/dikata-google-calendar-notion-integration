# dikata-google-calendar-notion-integration

A notion integration that synchronizes my Dikata Agenda &amp; Notes notion
database with my google calendar.

# What is It

This integration will synchronize new, deleted and updated pages in the
notion database with google calendar and vice-versa.

The main features of this integration are:

1. <span style="color: aqua">Create</span> new notion page <-> <span style="color: aqua">Create</span> new google calendar event
2. <span style="color: yellow">Update</span> notion page <-> <span style="color: yellow">Update</span> google calendar event
3. <span style="color: yellow">Update</span> notion page progress to cancelled <-> <span style="color: orangered">Delete</span> google calendar event
4. <span style="color: yellow">Update</span> notion page date -> <span style="color: yellow">Update</span> notion page progress
5. <span style="color: yellow">Update</span> google event date -> <span style="color: yellow">Update</span> notion page progress
6. <span style="color: orangered">Delete</span> notion page -> <span style="color: orangered">Delete</span> google calendar event

When updating a page, only the `Name`, `Date` and `Progress` property are considered by
this integration.

When updating a google calendar event, only the `Summary`/`Title` of the event and
the start & end time are considered by this integration.

# Target Database & Calendar

## Notion Database Schema

This integration was specifically made for my "dikata agenda and notes" notion
database and the calendar events that are targeted by this integration are the ones
whose title starts with "Dikata:" or "dikata" case-insensitive [(more on this later)](#how-it-works-sort-of).

But, this integration should target any notion database that has the same database
property schema as the one I'm using:

> ⭐ [Checkout notion database properties here](https://developers.notion.com/reference/property-object)

1. `"Name"` : `title`
2. `"Date"` : `date`
3. `"Progress"` : `select`
4. `"Summary"` : `rich_text`
5. `"Type"` : `select`

Just make a notion database with that schema and pass in the database id as
an environment variable later.

## Google Calendar

For the calendar, this integration should not target any specific kind of google
calendar. You just need to pass in your OAuth2 token later as an environment variable and
start any google calendar event title with "Dikata:" or "dikata" case-insensitive
[(more on this later)](#how-it-works-sort-of).

To change how the integration detects these specific events, you could change
codes that detects "Dikata" infront of the event title (like in `listDikataEvents`
and `isDikataEvent` helper).

# Summarized Integration Logic

## Helpers & Controllers

Provided in the source code are some JSDOCumented controllers and helpers that allows this
integration's operations to be simplified, reusable and modular. Most of the
helpers and controllers handle the CRUD operations this integration does, but there
are some other useful ones like `RFC3339` date formatters that the google
calendar API needs and the `Watcher` class.

You should take a look around to see if it can help you understand how this
integration works or create new features by reusing some of the existing helpers
and controllers (Sorry if my documentations are not good tho :P).

## Environment Variables

This project uses some environment variables which you should provide (although
I can't guarantee that everything is used since I already forgot :D):

```py
PATH_TO_ENV
PORT
MONGODB
NOTION_INTERNAL_INTEGRATION_TOKEN
NOTION_AGENDA_DB_ID
NOTION_SELECTION_PROGRESS_CANCELLED
NOTION_SELECTION_PROGRESS_DONE
NOTION_SELECTION_PROGRESS_IN_PROGRESS
NOTION_SELECTION_PROGRESS_NOT_YET
NOTION_SELECTION_TYPE_DEPARTMENT_MEETING
NOTION_SELECTION_TYPE_ORGANIZATION_MEETING
GOOGLE_CALENDAR_PRIMARY_CALENDARID
GOOGLE_CALENDAR_SERVICE_ACC_KEY
GOOGLE_CALENDAR_OAUTH2_PAT
GOOGLE_CALENDAR_OAUTH2_CB
GOOGLE_CALENDAR_OAUTH2_CLIENT_ID
GOOGLE_CALENDAR_OAUTH2_CLIENT_SECRET
GOOGLE_CALENDAR_OAUTH2_ACCESS_TOKEN
GOOGLE_CALENDAR_OAUTH2_REFRESH_TOKEN
NOTION_DIKATA_AGENDA_WATCHER_MS
GOOGLE_DIKATA_EVENTS_WATCHER_MS
```

## How it Works (sort of)

1. Add environment variables
    - For the google oauth2 tokens, you need to authenticate through a browser (I know
      sucks right) and get the access & refresh token to store as environment variables.
      This integration provides helpers for this.
2. When everything is set, the integration should start running by starting the
   watchers.
3. The first time the watchers start, they will scan through the database and calendar
   once to initialize a synchronization between database, calendar and out database.
    - The mongo database will act as a memo that stores sync information about a page
      and its respective event using the `PageEvent` model.
    - On the first calendar scan, the events that will be included are the ones
      whose title starts with "Dikata:", but the synchronization that happens
      after this initial one can also detect events whose title starts with
      "dikata" case-insensitive.
4. After that, the watchers will keep running every `ms` to keep synchronizing the
   database and calendar.

<p style="border: yellow solid 1px; padding: 1em; text-align: center">
    ⚠️
    <br/>
    <strong>
        Once this integration starts running, you should be careful about changing the mongo
        collection as to not cause unexpected behavior
    </strong>
    <br/>
    ⚠️
</p>

Sometimes you'll see some errors being logged when this integeration is running. But
from personal testing, most of them should be harmless (I hope).
