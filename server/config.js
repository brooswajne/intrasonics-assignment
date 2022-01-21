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

/** The port which the server should be listening on. */
export const PORT = process.env.IA_PORT || DEFAULT_PORT;
/** The directory containing all routes. */
export const DIR_ROUTES = process.env.IA_ROUTES || join(DIR_ROOT, "routes");
