import deleteEventUsingPage from "./delete/delete-event-using-page.js";
import deletePageUsingEvent from "./delete/delete-page-using-event.js";
import deleteUsingPageEvent from "./delete/delete-using-pageevent.js";
import insertEventToPage from "./create/insert-event-to-page.js";
import insertPageToEvent from "./create/insert-page-to-event.js";
import mapPageEvent from "./create/map-page-event.js";
import updateEventToPage from "./update/update-event-to-page.js";
import updatePageToEvent from "./update/update-page-to-event.js";

const pageEventController = {
	create : {
		insertEventToPage,
		insertPageToEvent,
		mapPageEvent,
	},
	delete : {
		deleteEventUsingPage,
		deletePageUsingEvent,
		deleteUsingPageEvent,
	},
	update : {
		updateEventToPage,
		updatePageToEvent
	}
};

export default pageEventController;