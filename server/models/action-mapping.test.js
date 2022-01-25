import { expect } from "chai";
import { fake } from "sinon";

import {
	findActionMappings,
	getActionMapping,
	getActionMappingsIterator,
	isValidActionId,
	isValidActionMapping,
	isValidCodeword,
} from "./action-mapping.js";

describe("server/models/action-mapping.js", function fileSuite( ) {

	describe("isValidCodeword()", function functionSuite( ) {

		it("should validate known cases as expected", function test( ) {
			// invalid cases
			expect(isValidCodeword(-1), "negative")
				.to.equal(false);
			expect(isValidCodeword(0), "non-positive")
				.to.equal(false);
			expect(isValidCodeword(3.1415), "non-integer")
				.to.equal(false);
			expect(isValidCodeword(Infinity), "non-finite")
				.to.equal(false);
			expect(isValidCodeword(Number.NaN), "non-numeric")
				.to.equal(false);
			// valid cases
			expect(isValidCodeword(12345), "valid codeword '12345'")
				.to.equal(true);
		});

	});

	describe("isValidActionId()", function functionSuite( ) {

		it("should validate known cases as expected", function test( ) {
			// invalid cases
			expect(isValidActionId(""), "empty")
				.to.equal(false);
			// valid cases
			expect(isValidActionId("alert"), "valid action id 'alert'")
				.to.equal(true);
			expect(isValidActionId("thanks"), "valid action id 'thanks'")
				.to.equal(true);
		});

	});

	describe("isValidActionMapping()", function functionSuite( ) {

		it("should validate known cases as expected", function test( ) {
			// invalid cases
			expect(isValidActionMapping(null), "nil")
				.to.equal(false);
			expect(isValidActionMapping({ }), "missing fields")
				.to.equal(false);
			expect(isValidActionMapping({
				codeword: "foo",
				actionId: "alert",
			}), "invalid codeword").to.equal(false);
			expect(isValidActionMapping({
				codeword: 1234,
				actionId: "",
			}), "invalid action id").to.equal(false);
			expect(isValidActionMapping({
				codeword: 1234,
				actionId: "alert",
				extraField: "oh no!",
			}), "extra fields").to.equal(false);
			// valid cases
			expect(isValidActionMapping({
				codeword: 1234,
				actionId: "alert",
			}), "valid").to.equal(true);
		});

	});

	describe("getActionMappingsIterator()", function functionSuite( ) {

		it("should yield valid action mappings from the database", async function test( ) {
			const mappings = [
				{ codeword: 5001, actionId: "alert" },
				{ codeword: 5002, actionId: "thanks" },
			];
			const readDatabase = fake(async function* yieldTestData( ) {
				yield* mappings;
			});

			const iterator = getActionMappingsIterator({
				database: "database.json",
				readDatabase: readDatabase,
			});
			expect(iterator).to.have.property(Symbol.asyncIterator);

			const yielded = [ ];
			for await (const entry of iterator[ Symbol.asyncIterator ]( )) yielded.push(entry);
			expect(yielded).to.deep.equal(mappings);

			expect(readDatabase).to.have.been.calledOnceWith("database.json");
		});

		it("should throw upon encountering an invalid action mapping", async function test( ) {
			const iterator = getActionMappingsIterator({
				async* readDatabase( ) {
					yield* [
						{ codeword: 1234, actionId: "valid" },
						{ "this one is invalid": true },
					];
				},
			});

			/** @type {Array<import("./action-mapping").ActionMapping>} */
			const yielded = [ ];
			await expect((async function iterate( ) {
				for await (const entry of iterator) yielded.push(entry);
			})( )).to.be.rejectedWith(Error, /invalid/i);

			expect(yielded).to.deep.equal([
				{ codeword: 1234, actionId: "valid" },
			]);
		});

	});

	describe("findActionMappings()", function functionSuite( ) {

		it("should only yield action mappings matching the applied filter", async function test( ) {
			const getAll = fake(async function* yieldTestData( ) {
				yield* [
					{ codeword: 1234, actionId: "matches" },
					{ codeword: 1235, actionId: "matches" },
					{ codeword: 1236, actionId: "doesn't match" },
					{ codeword: 1237, actionId: "matches" },
				];
			});
			const iterator = findActionMappings({ actionId: "matches" }, { getAll });
			expect(iterator).to.have.property(Symbol.asyncIterator);

			const yielded = [ ];
			for await (const entry of iterator[ Symbol.asyncIterator ]( )) yielded.push(entry);
			expect(yielded).to.deep.equal([
				{ codeword: 1234, actionId: "matches" },
				{ codeword: 1235, actionId: "matches" },
				{ codeword: 1237, actionId: "matches" },
			]);

			expect(getAll).to.have.callCount(1);
		});

	});

	describe("getActionMapping()", function functionSuite( ) {

		it("should return the first matching action mapping found", async function test( ) {
			const getAll = fake(async function* yieldTestData( ) {
				yield* [
					{ codeword: 31415, actionId: "hay" },
					{ codeword: 27182, actionId: "hay" },
					{ codeword: 42, actionId: "needle" },
					{ codeword: 16180, actionId: "hay" },
				];
			});
			const match = await getActionMapping(42, { getAll });
			expect(match).to.deep.equal({
				codeword: 42,
				actionId: "needle",
			});
		});

		it("should return null if no match is found", async function test( ) {
			const getAll = fake(async function* yieldTestData( ) {
				yield* [
					{ codeword: 31415, actionId: "pi" },
					{ codeword: 27182, actionId: "e" },
					{ codeword: 16180, actionId: "phi" },
				];
			});
			const match = await getActionMapping(66260, { getAll });
			expect(match).to.equal(null);
		});

	});

});
