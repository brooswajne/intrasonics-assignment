import { expect } from "chai";
import { fake } from "sinon";

import { NotFoundError } from "../../server/errors.js";

import {
	GET,
	parseCodeword,
} from "./[codeword].js";

describe("routes/actions/[codeword].js", function fileSuite( ) {

	describe("parseCodeword()", function functionSuite( ) {

		it("should throw if the codeword is invalid", async function test( ) {
			await Promise.all([
				// @ts-expect-error -- purposefully not providing a string
				expect(parseCodeword(undefined), "no codeword")
					.to.be.rejectedWith(Error),
				expect(parseCodeword(""), "empty codeword")
					.to.be.rejectedWith(Error),
				expect(parseCodeword("foo"), "non-numeric codeword")
					.to.be.rejectedWith(Error),
				expect(parseCodeword("-1"), "negative codeword")
					.to.be.rejectedWith(Error),
				expect(parseCodeword("0"), "non-positive codeword")
					.to.be.rejectedWith(Error),
				expect(parseCodeword("3.1415"), "non-integer codeword")
					.to.be.rejectedWith(Error),
				expect(parseCodeword(`${Number.MAX_VALUE}0`), "codeword out of range")
					.to.be.rejectedWith(Error),
			]);
		});

	});

	describe("GET()", function handlerSuite( ) {

		// looking for a 404 to be thrown if an invalid codeword is provided, as
		// it means the called endpoint was something like /actions/foo, which
		// isn't a real endpoint
		it("should throw a NotFoundError if the codeword is not valid", async function test( ) {
			const logger = { debug: fake( ) };
			const getParsedCodeword = fake.rejects(new Error("Failed to parse"));

			// @ts-expect-error -- request object is obviously not a real request
			await expect(GET({
				params: { },
			}, { logger }, { getParsedCodeword })).to.be.rejectedWith(NotFoundError);
		});

	});

});
