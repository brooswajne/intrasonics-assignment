// This file exports some utility methods for interacting with the "database"
// during API tests, allowing us to insert some data into it and clear it
// easily.
// Obviously, with a real database this would work slightly differently and
// not just be constantly writing to a file on disk.

import { writeFile } from "fs/promises";

import { DB_ACTION_MAPPINGS } from "../../server/config.js";

/** @typedef {import("../../server/models/action-mapping").ActionMapping} ActionMapping */

export async function clearDatabase( ) {
	await writeFile(DB_ACTION_MAPPINGS, "[]");
}

/** @param {ActionMapping[]} data */
export async function seedDatabase(data) {
	await writeFile(DB_ACTION_MAPPINGS, JSON.stringify(data));
}
