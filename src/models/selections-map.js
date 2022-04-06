/*
================================================================================

This module stores the map for the notion agenda database's selection properties
selections with the schema of { [selectionName : string] : [selectionId : string] }.

We will use their id's across this project since even if we change the name in notion
it will still target the same selection. Although, this means that WE SHOULD NOT
DELETE OUR OLD SELECTIONS ANYMORE, MKAY???? >:(

================================================================================
*/

if (process.env.NODE_ENV !== "production") {
	await import("dotenv/config");
}

/**
 * The "Progress" property selections id map
 */
export const Progress = {
	"Cancelled"   : process.env.NOTION_SELECTION_PROGRESS_CANCELLED,
	"Done"        : process.env.NOTION_SELECTION_PROGRESS_DONE,
	"In Progress" : process.env.NOTION_SELECTION_PROGRESS_IN_PROGRESS,
	"Not Yet"     : process.env.NOTION_SELECTION_PROGRESS_NOT_YET,
};

/**
 * The "Type" property selections id map
 */
export const Type = {
	"Department Meeting"   : process.env.NOTION_SELECTION_TYPE_DEPARTMENT_MEETING,
	"Organization Meeting" : process.env.NOTION_SELECTION_TYPE_ORGANIZATION_MEETING,
};
