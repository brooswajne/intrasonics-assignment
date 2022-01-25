import {
	BadRequestError,
	NotFoundError,
} from "../../server/errors.js";
import {
	getActionMapping,
	isValidCodeword,
} from "../../server/models/action-mapping.js";

/**
 * @type {import("../../server/routing").RequestHandler}
 * Gets a single action by its codeword (provided as a route parameter).
 * @returns {Promise<import("../../server/models/action-mapping").ActionMapping | null>}
 */
export async function GET(request, { logger }, {
	// for dependency injection (in tests):
	validateCodeword = isValidCodeword,
	getActionMappingWithCodeword = getActionMapping,
} = { }) {
	const codeword = Number(request.params.codeword);
	if (!validateCodeword(codeword)) throw new BadRequestError("Invalid codeword");

	// TODO: decide if we want caching here?
	//       once a match is found it is unlikely to change, but how much data
	//       do we want to keep in memory

	logger.trace(`Looking for an ActionMapping with codeword ${codeword}`);
	const mapping = await getActionMappingWithCodeword(codeword);
	if (!mapping) throw new NotFoundError(`No ActionMapping found with codeword ${codeword}`);

	return mapping;
}
