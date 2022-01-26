import { expect } from "chai";
import { fake } from "sinon";

import { BadRequestError } from "../server/errors.js";

import {
	GET,
	parseFilter,
} from "./actions.js";

describe("routes/actions.js", function fileSuite( ) {

	describe("parseFilter()", function functionSuite( ) {

		it("should throw an error if the filter is invalid", async function test( ) {
			await Promise.all([
				// @ts-expect-error -- purposefully passing the wrong type
				expect(parseFilter(null), "no filter")
					.to.be.rejectedWith(Error),
				// @ts-expect-error -- purposefully passing the wrong type
				expect(parseFilter("not an object"), "non-object filter")
					.to.be.rejectedWith(Error),

				// TODO: should probably just stub the isValidCodeword() dependency
				expect(parseFilter({ codeword: "invalid" }), "invalid codeword (string)")
					.to.be.rejectedWith(Error),
				expect(parseFilter({ codeword: "3.1415" }), "invalid codeword (non-integer)")
					.to.be.rejectedWith(Error),

				// TODO: should probably just stub the isValidActionId() dependency
				expect(parseFilter({ actionId: [ "in", "valid" ] }), "invalid action id")
					.to.be.rejectedWith(Error),

				expect(parseFilter({ unexpected: "field" }), "extra field")
					.to.be.rejectedWith(Error),
			]);
		});

		it("should return the correctly parsed filter", async function test( ) {
			await Promise.all([
				expect(parseFilter({ })).to.become({ }),

				expect(parseFilter({
					codeword: "31415",
				})).to.become({ codeword: 31415 }),

				expect(parseFilter({
					actionId: "word",
				})).to.become({ actionId: "word" }),

				expect(parseFilter({
					codeword: "31415",
					actionId: "word",
				})).to.become({
					codeword: 31415,
					actionId: "word",
				}),
			]);
		});

	});

	describe("GET()", function handlerSuite( ) {

		it("should throw a BadRequestError if the filter fails to parse", async function test( ) {
			const logger = { error: fake( ) };
			const filterParser = fake.rejects(new Error("Failed to parse"));

			// @ts-expect-error -- not a real request object
			await expect(GET({
				query: { },
			}, { logger }, { filterParser }))
				.to.be.rejectedWith(BadRequestError);

			expect(filterParser).to.have.callCount(1);
		});

		it("should return an array of all action mapping iterated", async function test( ) {
			const logger = { trace: fake( ) };
			const filter = { foo: "bar" };
			const filterParser = fake.resolves(filter);
			const findMappings = fake(function* yieldTestData( ) {
				yield* [ "one", "two", "three", "four" ];
			});

			// @ts-expect-error -- not a real request object
			const resolved = await GET({
				query: { },
			}, { logger }, { filterParser, findMappings });

			expect(findMappings).to.have.been.calledOnceWithExactly(filter);
			expect(resolved).to.be.an("array")
				.and.to.have.members([ "one", "two", "three", "four" ]);
		});

	});

});
