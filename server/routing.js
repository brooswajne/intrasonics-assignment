// This file contains the logic for the file-based routing mechanism used by
// this web application.

import {
	extname,
	join,
	relative,
} from "path";
import { METHODS } from "http";
import { readdir as fsReaddir } from "fs/promises";

import { Router as createRouter } from "express";

import { HttpError } from "./errors.js";
import { logger as rootLogger } from "./logger.js";

const logger = rootLogger.child("routing");

/** @typedef {(req: import("express").Request) => Promise<any>} RequestHandler */

/**
 * Recursively traverses all files in the given directory, calling the provided
 * `visit` callback for each file.
 * @param {string} directory
 * @param {(filepath: string) => Promise<void>} visit
 * @param {object} [options]
 * @param {import("fs/promises").readdir} [options.readdir]
 * A custom implementation of `fs.readdir`.
 * Useful for providing stubs in a testing context.
 */
async function traverse(directory, visit, {
	readdir = fsReaddir,
} = { }) {
	const entries = await readdir(directory, { withFileTypes: true });
	await Promise.all(entries.map(async function handleEntry(entry) {
		const file = entry.name;
		const path = join(directory, file);
		if (entry.isDirectory( )) await traverse(path, visit, { readdir });
		else await visit(path);
	}));
}

/**
 * Given a function which acts as a promise-based request handler, turns it
 * into an express.js request handler.
 * @param {RequestHandler} handler
 * @returns {import("express").RequestHandler}
 */
function toExpressHandler(handler) {
	return (req, res, next) => Promise.resolve( )
		.then(( ) => handler(req))
		.then((response) => res.send(response))
		.catch(function handleError(err) {
			const isHttpError = typeof err === "object"
				&& err instanceof HttpError;
			if (!isHttpError) next(err);
			else res.status(err.status).send(err.message);
		});
}

/**
 * Creates a new `express.Router` which uses simple folder-based routing for the
 * given directory.
 * The directory will be recursively traversed, and any JavaScript files found
 * within will be imported asynchronously. Any functions exported by those files
 * which match HTTP verbs (eg. GET/POST/...) will be used as route-handlers for
 * those routes.
 * To use route parameters, use square-brackets in the file's name, eg. a file
 * at path `/foo/[id].js` would register a route under `/foo/:id`.
 *
 * @param {string} directory
 *
 * @param {object} [options]
 * @param {(file: string) => Promise<any>} [options.importer]
 * An override for the mechanism to import a javascript file. Defaults to just
 * using an ES6 asynchronous import.
 * Useful for providing stubs in a testing context.
 * @param {import("express").Router} [options.router]
 * The express router which routes should be registered to. If none is provided,
 * a new router instance will be created.
 * Useful for providing stubs in a testing context.
 * Note that this router will be the one returned by the call to this function.
 * @param {import("fs/promises").readdir} [options.readdir]
 * A custom implementation of `fs.readdir`.
 * Useful for providing stubs in a testing context.
 *
 * @returns {Promise<import("express").Router>}
 */
export async function createFileBasedRouter(directory, {
	importer = (file) => import(file),
	readdir = fsReaddir,
	router = createRouter( ),
} = { }) {
	logger.debug(`Creating a file-based router using root: ${directory}`);

	await traverse(directory, async function initialiseRoute(filepath) {
		const isJavascript = extname(filepath) === ".js";
		if (!isJavascript) return;

		const route = relative(directory, filepath)
			// turn square brackets into route parameters
			.replace(/\[(\w+)]/g, (_, param) => `:${param}`)
			// strip the file extension
			.replace(/\.js$/, "");

		// register any handlers we find for this file
		const exported = await importer(filepath);
		for (const name in exported) {
			const isValidHttpMethod = METHODS.includes(name);
			if (!isValidHttpMethod) continue;

			const handler = exported[ name ];
			const isValidHandler = typeof handler === "function";
			if (!isValidHandler) continue;

			const expressMethodName = name.toLowerCase( );
			// TODO: abstract isValidHttpMethod in a way that makes this type-safe
			// @ts-expect-error -- doesn't know that expressMethodName isn't just any string
			router[ expressMethodName ](`/${route}`, toExpressHandler(handler));
			logger.trace(`Initialised route: ${name} ${route}`);
		}
	}, { readdir });

	return router;
}
