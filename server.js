import express from "express";

import {
	DIR_ROUTES,
	PORT,
} from "./server/config.js";
import { createFileBasedRouter } from "./server/routing.js";
import { defaultErrorHandler } from "./server/errors.js";
import { logger } from "./server/logger.js";

const app = express( );

logger.debug("Initialising application routes..");
const router = await createFileBasedRouter(DIR_ROUTES);
app.use(router);

app.get("/", function getGreeting(_, res) {
	res.send("Hello world");
});

app.use(defaultErrorHandler);

logger.debug("Starting application...");
app.listen(PORT, function onceListening( ) {
	logger.info(`Server started successfully. Listening on port ${PORT}.`);
});
