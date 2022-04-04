/**
 * Validates a date string using the RFC3339 standard.
 *
 * @param {string} date A RFC3339 timestamp with or without time zone offset.
 *
 * @param {boolean} throwErr
 *
 * @throws if {@link throwErr} is true and the date string is invalid.
 */
export const validateRFC3339 = (date, throwErr = false) => {
	// Year must be 4 characters and there is no limit
	const YY = "[0-9]{4}";
	// Month must be from 00-12
	const MM = "(0[1-9]|1[0-2])";
	// Date must be from 01-31
	const DD = "(0[1-9]|[12][0-9]|3[01])";
	// Hour must be from 00-23
	const HH = "([0-1][0-9]|2[0-3])";
	// Minute must be from 00-59
	const MMinute = "([0-5][0-9])";
	// Second must be from 00-59
	const SS = "([0-5][0-9])";
	// Optional timezone offset
	const TZ = "(Z|[-,+][0-9]{2}:[0-9]{2})?";

	const rfc3339Format = new RegExp(`^${YY}-${MM}-${DD}(T${HH}:${MMinute}:${SS}${TZ})?$`);
	const testRes = rfc3339Format.test(date);

	if (throwErr && !testRes) {
		throw new Error("Invalid date! date must be formatted in \"YYYY-MM-DD\" or \"YYYY-MM-DDTHH:MM:SS\" and must not exceed each time's limit, e.g. HH can't be more than 23.");
	}

	return testRes;
};

/**
 * Function to create a RFC3339 formatted date string
 *
 * @param {number} YY
 *
 * @param {number} MM
 *
 * @param {number} DD
 *
 * @param {number} HH
 *
 * @param {number} MMinute
 *
 * @param {number} SS
 *
 * @param {string} TZ Optional timezone offset, e.g. "Z" or "+07:00".
 *
 * @returns {string}
 *
 * @throws if {@link MMinute} or {@link SS} is missing when {@link HH} is set.
 */
export const createRFC3339 = (YY, MM, DD, HH = "", MMinute = "", SS = "", TZ = "") => {
	// Helpful code so the user can just pass the number
	MM = MM < 10 ? `0${MM}` : MM;
	DD = DD < 10 ? `0${DD}` : DD;
	HH = HH !== "" && HH < 10 ? `0${HH}` : HH;
	MMinute = MMinute !== "" && MMinute < 10 ? `0${MMinute}` : MMinute;
	SS = SS !== "" && SS < 10 ? `0${SS}` : SS;

	let YYMMDD = `${YY}-${MM}-${DD}`;

	if (HH !== "") {
		if (MMinute === "" || SS === "") {
			throw new Error("If HH is set, MMinute and SS must be set.");
		}

		const THHMMinuteSS = `T${HH}:${MMinute}:${SS}`;
		YYMMDD += THHMMinuteSS;
	}

	if (TZ !== "") {
		// Allows the user to pass in low case "z" without causing an error
		TZ = TZ === "z" ? "Z" : TZ;

		YYMMDD += TZ;
	}

	validateRFC3339(YYMMDD, true);

	return YYMMDD;
};


