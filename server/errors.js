// This file exports error classes to make error handling in our file-based
// routing framework very ergonomic.
// Your promise-based request handler just needs to throw an error extending
// the HttpError class, and the original request will be responded to with
// the associated error status / message.

import { logger } from "./logger.js";

const STATUS_CODE_NOT_FOUND = 404;
const STATUS_CODE_INTERNAL = 500;

export class HttpError extends Error {
	/**
	 * @param {number} status
	 * @param {string} message
	 */
	constructor(status, message) {
		super(message);
		this.status = status;
		this.name = "HttpError";
	}
}

export class NotFoundError extends HttpError {
	constructor(message = "Not Found") {
		super(STATUS_CODE_NOT_FOUND, message);
		this.name = "NotFoundError";
	}
}

export class InternalError extends HttpError {
	constructor(message = "Internal Server Error") {
		super(STATUS_CODE_INTERNAL, message);
		this.name = "InternalError";
	}
}

/**
 * @type {import("express").ErrorRequestHandler}
 * The default express.js error handler to be applied as a last fallback for
 * all requests.
 */
// eslint-disable-next-line max-params -- required by express.js
export function defaultErrorHandler(err, _req, res, _next) {
	logger.error(err);
	res.status(STATUS_CODE_INTERNAL).send("Internal Server Error");
}
