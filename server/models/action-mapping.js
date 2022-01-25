import { DB_ACTION_MAPPINGS } from "../config.js";
import { getDatabaseEntriesIterator } from "../database.js";

/**
 * @typedef {object} ActionMapping
 * Maps unique audio watermarks (labelled as "codewords") to the action they
 * should trigger downstream when detected.
 *
 * @property {number} codeword
 * The unique audio watermark which may be detected in an audio stream.
 * @property {string} actionId
 * The ID of the action which should be triggered downstream when the
 * associated codeword is detected in an audio stream.
 */

/**
 * Returns whether the given numeric value is a valid codeword which can
 * be detected in an audio stream.
 *
 * Note that this makes some assumptions about what a codeword should look like:
 * The assignment brief doesn't actually say that codewords must be a positive
 * integer, but the example makes it look that way.
 * Obviously in a proper implementation we'd need to take the time to clarify
 * the spec before implementing this.
 *
 * @param {number} codeword
 */
export const isValidCodeword = (codeword) => codeword > 0 && Number.isInteger(codeword);

/**
 * Returns whether the given string is a valid action ID which can be triggered.
 *
 * Again, this is just making assumptions about action IDs (although assuming
 * that they need to be non-empty seems safe).
 *
 * @param {string} actionId
 */
export const isValidActionId = (actionId) => actionId !== "";

/**
 * Returns whether the given object is a valid ActionMapping entry.
 * @param {any} mapping
 * @returns {mapping is ActionMapping}
 */
export const isValidActionMapping = (mapping) => mapping != null
	&& typeof mapping === "object"
	// has a valid codeword
	&& typeof mapping.codeword === "number" && isValidCodeword(mapping.codeword)
	// has a valid action id
	&& typeof mapping.actionId === "string" && isValidActionId(mapping.actionId)
	// and nothing else
	&& Object.keys(mapping).length === 2;

/**
 * Returns an async iterator which iterates over all action mapping stored
 * in the given database.
 * @param {object} [options]
 * @param {string} [options.database]
 * The path to the action mapping database to be read.
 * @param {(database: string) => AsyncGenerator<unknown>} [options.readDatabase]
 * An implementation of the mechanism for iterating over all _raw_ database
 * entries (ie. without validation of their type).
 * Useful for providing stubs in a testing context.
 * @returns {AsyncGenerator<ActionMapping>}
 */
export async function* getActionMappingsIterator({
	database = DB_ACTION_MAPPINGS,
	readDatabase = getDatabaseEntriesIterator,
} = { }) {
	let index = 0;
	for await (const entry of readDatabase(database)) {
		if (!isValidActionMapping(entry)) {
			const identifier = `entry #${index}`;
			const context = `database: ${database}`;
			throw new Error(`ActionMapping database ${identifier} is invalid (${context})`);
		}
		yield entry;
		index += 1;
	}
}

/**
 * Given a filter to apply to action mappings, returns an async iterator which
 * yields ActionMapping models matching that filter.
 * @param {Partial<ActionMapping>} [filter]
 * The properties which are being looked for on the action mappings.
 * @param {object} [options]
 * @param {() => AsyncGenerator<ActionMapping>} [options.getAll]
 * An implementation of the mechanism for iterating over _all_ action mappings
 * in the database.
 * Useful for providing stubs in a testing context.
 * @returns {AsyncGenerator<ActionMapping>}
 */
export async function* findActionMappings(filter = { }, {
	getAll = getActionMappingsIterator,
} = { }) {
	const filteredFields = /** @type {Array<keyof ActionMapping>} */ (Object.keys(filter));
	for await (const mapping of getAll( )) {
		const isWanted = filteredFields
			.every((field) => mapping[ field ] === filter[ field ]);
		if (isWanted) yield mapping;
	}
}

/**
 * Given a codeword (which uniquely identifies action mappings), returns the
 * action mapping with that codeword.
 * Note that this does not guarantee that the database doesn't include more
 * than one action mapping for that codeword - that validation should be done
 * at insert time.
 * @param {number} codeword
 * @param {object} [options]
 * @param {() => AsyncGenerator<ActionMapping>} [options.getAll]
 * An implementation of the mechanism for iterating over _all_ action mappings
 * in the database.
 * Useful for providing stubs in a testing context.
 * @returns {Promise<ActionMapping | null>}
 */
export async function getActionMapping(codeword, {
	getAll = getActionMappingsIterator,
} = { }) {
	for await (const mapping of getAll( )) {
		const isWanted = mapping.codeword === codeword;
		if (isWanted) return mapping;
	}
	return null;
}
