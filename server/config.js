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
export const PORT = Number(process.env.IA_PORT) || DEFAULT_PORT;

/** @type {string} The directory containing all routes. */
export const DIR_ROUTES = process.env.IA_ROUTES || join(DIR_ROOT, "routes");

/** @type {string} The database of action mappings. */
export const DB_ACTION_MAPPINGS = process.env.IA_DB_ACTION_MAPPINGS
	|| join(DIR_ROOT, "actions.json");
