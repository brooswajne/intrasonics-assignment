// This file reads an re-exports all of the app's configuration, so that
// it can all be co-located in this one place.
// TODO: a better configuration mechanism than just environment variables.

import {
	dirname,
	join,
} from "path";

const DEFAULT_PORT = 3000;

const DIR_HERE = dirname(import.meta.url.slice("file://".length));
const DIR_ROOT = join(DIR_HERE, "../");

/** @type {number} The port which the server should listen on. */
export const PORT = Number(process.env.IA_PORT)
	|| DEFAULT_PORT;

/** @type {string} The directory containing all routes. */
export const DIR_ROUTES = process.env.IA_ROUTES
	|| join(DIR_ROOT, "routes");

/** @type {string} The database to read data from (path to json file). */
export const DB_NAME = process.env.IA_DB_NAME
	|| join(DIR_ROOT, "actions.json");

/** @type {string} The database "table" (object key) storing action mappings. */
export const DB_TABLE_ACTION_MAPPINGS = process.env.IA_DB_TABLE_ACTION_MAPPINGS
	|| "actions";
