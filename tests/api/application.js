// This file should be imported by API tests, it creates the express server
// application and exports methods to assert on its behaviour.

import supertest from "supertest";

import {
	DIR_ROUTES,
	PORT,
} from "../../server/config.js";
import { createApplication } from "../../server/application.js";

const { app } = await createApplication({
	port: PORT,
	routes: DIR_ROUTES,
});

/** The web application wrapped by supertest. */
export const api = supertest(app);
