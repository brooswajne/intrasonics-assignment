// This file reads an re-exports all of the app's configuration, so that
// it can all be co-located in this one place.
// TODO: a better configuration mechanism than just environment variables.

const DEFAULT_PORT = 3000;

/** The port which the server should be listening on. */
export const PORT = process.env.PORT ?? DEFAULT_PORT;
