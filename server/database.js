// This file is our "database" layer implementation.
// Obviously, for the purpose of this assignment our database is just a single
// text file containing a big JSON blob which has to entirely be read and parsed
// into memory and then manually traversed. Not great, but still nice to have
// this abstraction so that implementation can be changed.
//
// TODO: investigate alternative implementations
//       - if we are worried about the size of the actions.json file, and don't
//         want to read its entire contents into memory, we could try something
//         like:
//         https://github.com/dominictarr/JSONStream
//       - if we are instead only worried about the speed of reads, it would
//         be nice to "index" the database when we read it into memory by for
//         example creating a Map() of codewords to their mapping entry
//       - if we care about both, we probably want to stream the data but
//         implement some caching at the endpoint-level

import { readFile } from "fs/promises";

/**
 * "Connects" to the database (json file) at the given path, reading its
 * contents and returning an async iterator which can be used to iterate
 * over all of its entries.
 * @param {string} database
 * @param {object} [options]
 * @param {typeof import("fs/promises").readFile} [options.read]
 * A custom implementation of the function used to read the database contents
 * into memory.
 * Useful for providing stubs in a testing context.
 * @returns {AsyncGenerator<unknown>}
 */
export async function* getDatabaseEntriesIterator(database, {
	read = readFile,
} = { }) {
	const contents = await read(database, { encoding: "utf-8" });
	const entries = /** @type {unknown} */ (JSON.parse(contents));
	if (!Array.isArray(entries)) throw new Error(`Database (${database}) not an array`);
	yield* entries;
}
