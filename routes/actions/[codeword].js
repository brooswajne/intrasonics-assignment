import { NotFoundError } from "../../server/errors.js";

/**
 * @type {import("../../server/routing").RequestHandler}
 * Gets a single action by its codeword (provided as a route parameter).
 */
export async function GET(request) {
	const { codeword } = request.params;
	if (!codeword) throw new Error("Missing action codeword");

	const parsed = Number(codeword);
	if (!Number.isInteger(parsed)) throw new NotFoundError(`Invalid codeword: ${codeword}`);

	return [ {
		codeword: parsed,
		id: "thanks!",
	} ];
}
