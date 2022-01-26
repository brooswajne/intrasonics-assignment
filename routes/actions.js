import {
	findActionMappings,
	isValidActionId,
	isValidCodeword,
} from "../server/models/action-mapping.js";
import { BadRequestError } from "../server/errors.js";

/** @typedef {import("../server/models/action-mapping.js").ActionMapping} ActionMapping */

/**
 * Parses a query string object into a valid ActionMapping filter, throwing
 * an error if the filter is invalid for some reason.
 * @param {import("qs").ParsedQs} filter
 * @returns {Promise<Partial<ActionMapping>>}
 */
export async function parseFilter(filter) {
	if (filter == null) throw new Error("No filter provided");
	if (typeof filter !== "object") throw new Error("Filter is not an object");

	const parsed = { };

	// iterate over each field, validating and converting it if necessary
	for (const field in filter) {
		const value = filter[ field ];
		switch (field) {
		case "codeword": {
			// validate
			if (typeof value !== "string") throw new Error(`Invalid codeword: ${value}`);
			const codeword = Number(value);
			if (!isValidCodeword(codeword)) throw new Error(`Invalid codeword: ${codeword}`);
			// is valid, add it to the parsed object
			parsed.codeword = codeword;
			break;
		}
		case "actionId": {
			// validate
			if (typeof value !== "string") throw new Error(`Invalid actionId: ${value}`);
			if (!isValidActionId(value)) throw new Error(`Invalid actionId: ${value}`);
			// is valid, add it to the parsed object
			parsed.actionId = value;
			break;
		}
		// unexpected, unknown field, so invalid
		default: throw new Error(`Invalid filter field: ${field}`);
		}
	}

	return parsed;
}

/**
 * @type {import("../server/routing").RequestHandler}
 * Gets all actions matching the applied filter (in query parameters).
 * @returns {Promise<ActionMapping[]>}
 */
export async function GET(request, { logger }, {
	// for dependency injection
	filterParser = parseFilter,
	findMappings = findActionMappings,
} = { }) {
	const filter = await filterParser(request.query).catch(function handleParseError(err) {
		logger.error("Unable to parse filter:", request.query, err);
		throw new BadRequestError("Invalid filter");
	});

	const mappings = [ ];
	logger.trace("Requesting all actions with query:", filter);
	for await (const mapping of findMappings(filter)) mappings.push(mapping);

	return mappings;
}
