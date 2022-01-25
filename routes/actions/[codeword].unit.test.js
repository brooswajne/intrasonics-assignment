import { expect } from "chai";
import { fake } from "sinon";

import {
	BadRequestError,
	NotFoundError,
} from "../../server/errors.js";

import { GET } from "./[codeword].js";

describe("routes/actions/[codeword].js", function fileSuite( ) {

	describe("GET()", function handlerSuite( ) {

		it("should throw a BadRequestError if the codeword is not valid", async function test( ) {
			const logger = { trace: fake( ) };
			const getParsedCodeword = fake.rejects(new Error("Failed to parse"));

			// @ts-expect-error -- request object is obviously not a real request
			await expect(GET({
				params: { },
			}, { logger }, { getParsedCodeword })).to.be.rejectedWith(BadRequestError);
		});

		it("should throw a NotFoundError if the mapping isn't found", async function test( ) {
			const logger = { trace: fake( ) };
			const getParsedCodeword = fake.resolves(1234);
			const getActionMappingWithCodeword = fake.resolves(null);

			// @ts-expect-error -- request object is obviously not a real request
			await expect(GET({
				params: { codeword: "1234" },
			}, { logger }, { getParsedCodeword, getActionMappingWithCodeword }))
				.to.be.rejectedWith(NotFoundError);
		});

		it("should return the mapping if it is found", async function test( ) {
			const mapping = {
				codeword: 1234,
				actionId: "wow!",
			};

			const logger = { trace: fake( ) };
			const getParsedCodeword = fake.resolves(mapping.codeword);
			const getActionMappingWithCodeword = fake.resolves(mapping);

			// @ts-expect-error -- request object is obviously not a real request
			const returned = await GET({
				params: { codeword: "1234" },
			}, { logger }, { getParsedCodeword, getActionMappingWithCodeword });

			expect(returned).to.equal(mapping);
		});

	});

});
