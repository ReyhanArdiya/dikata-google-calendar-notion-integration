import mongoose from "mongoose";
import { validateRFC3339 } from "../helpers/dates/RFC3339.js";

const PageEventSchema = new mongoose.Schema({
	date : {
		required : true,
		type     : {
			end : {
				required : true,
				type     : String,
				validate : {
					validator : v => validateRFC3339(v, {
						TZOpt    : false,
						throwErr : true
					})
				}
			},
			start : {
				required : true,
				type     : String,
				validate : {
					validator : v => validateRFC3339(v, {
						TZOpt    : false,
						throwErr : true
					})
				}
			}
		},
	},
	eventId : {
		required : true,
		type     : String,
		unique   : true
	},
	pageId : {
		required : true,
		type     : String,
		unique   : true
	},
	title : {
		required : true,
		type     : String,
		unique   : true
	}
}, { strict : "throw" });

const PageEvent = mongoose.model("PageEvent", PageEventSchema);

export default PageEvent;