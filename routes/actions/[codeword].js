import { NotFoundError } from "../../server/errors.js";

/**
 * Parses a user-provided codeword into its numeric codeword value, or throws
 * an error if it is invalid.
 *
 * Note that this makes some assumptions about what a codeword should look like:
 * The assignment brief doesn't actually say that codewords must be a positive
 * integer, but the example makes it look that way.
 * Obviously in a proper implementation we'd need to take the time to clarify
 * the spec before implementing this.
 *
 * @param {string} string
 * The raw codeword to be parsed.
 * @returns {Promise<number>}
 */
export async function parseCodeword(string) {
	if (!string) throw new Error("No codeword provided");

	const codeword = Number(string);
	if (!Number.isInteger(codeword)) throw new Error("Codeword is not an integer");
	if (codeword <= 0) throw new Error("Codeword is not positive");

	return codeword;
}

/**
 * @type {import("../../server/routing").RequestHandler}
 * Gets a single action by its codeword (provided as a route parameter).
 */
export async function GET(request, { logger }, {
	// dependencies to inject for testing purposes
	getParsedCodeword = parseCodeword,
} = { }) {
	const raw = request.params.codeword;
	const codeword = await getParsedCodeword(raw).catch(function handleInvalidCodeword(err) {
		logger.debug(`Unable to parse codeword ${raw}:`, err);
		throw new NotFoundError("Invalid codeword");
	});

	return [ {
		codeword: codeword,
		id: "thanks!",
	} ];
}
