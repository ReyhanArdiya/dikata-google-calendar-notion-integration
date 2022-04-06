import { GetColorName } from "hex-color-to-color-name";

/**
 * Returns a map of the colorName as the key that contains info about its
 * id & hex from {@link calendar}'s `event` colors.
 *
 * @param {import("googleapis").calendar_v3.Calendar} calendar
 *
 * @returns {Promise<{[colorName: string]: {id: number, hex: string}}>}
 */
const getColorsIdMap = async calendar => {
	const { data: { event } } = await calendar.colors.get();

	const colorMap = {};
	for (const [ id, { background: hex } ] of Object.entries(event)) {
		colorMap[GetColorName(hex)] = {
			hex,
			id,
		};
	}

	return colorMap;
};

export default getColorsIdMap;