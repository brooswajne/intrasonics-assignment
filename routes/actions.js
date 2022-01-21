import { logger } from "../server/logger.js";

/**
 * @type {import("../server/routing").RequestHandler}
 * Gets all actions matching the applied filter (in query parameters).
 */
export async function GET(request) {
	const filter = request.query;
	// TODO: add a per-request logger child
	logger.info("Requesting all actions with query:", filter);

	return [ {
		codeword: 31415,
		id: "cake",
	}, {
		codeword: 27182,
		id: "eek",
	} ];
}
