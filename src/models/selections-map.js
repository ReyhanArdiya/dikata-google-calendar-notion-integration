/*
================================================================================

This module stores the map for the notion agenda database's selection properties
selections with the schema of { [selectionName : string] : [selectionId : string] }.

We will use their id's across this project since even if we change the name in notion
it will still target the same selection. Although, this means that WE SHOULD NOT
DELETE OUR OLD SELECTIONS ANYMORE, MKAY???? >:(

================================================================================
*/

/**
 * The "Progress" property selections id map
 */
export const Progress = {
	"Cancelled"   : "4d8645ca-5070-445d-8ca7-9b648ae94bfc",
	"Done"        : "8d19d72d-cfbf-44e9-ac1c-ce7ffeb820d8",
	"In Progress" : "747dc5e1-9778-46be-9dc8-cbca7171d26d",
	"Not Yet"     : "54a229a2-4699-4ee1-a86c-3af09d2c6605",
};

/**
 * The "Type" property selections id map
 */
export const Type = {
	"Department Meeting"   : "9caf6ce2-f9c7-480d-b3ed-b3f11ea77d2a",
	"Organization Meeting" : "ca982fa8-0a24-4f47-ac48-832b09e82640"
};
