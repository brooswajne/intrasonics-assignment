import { expect } from "chai";

import {
	clearDatabase,
	seedDatabase,
} from "../../tests/api/database.js";
import { api } from "../../tests/api/application.js";

describe("GET /actions/:codeword", function endpointSuite( ) {

	it("should 400 if the codeword is invalid", async function test( ) {
		const expectedStatus = 400;
		/** @param {string} codeword */
		const testCase = async (codeword, description = `with codeword ${codeword}`) => {
			const { status } = await api.get(`/actions/${codeword}`);
			expect(status, description).to.equal(expectedStatus);
		};
		await Promise.all([
			testCase("foo"),
			testCase("-1"),
			testCase("0"),
			testCase("3.1415"),
			testCase(`${Number.MAX_VALUE}0`, "codeword out of js number range"),
		]);
	});

	it("should 404 if an action mapping with the codeword is not found", async function test( ) {
		await clearDatabase( );
		return api.get("/actions/1234").expect(404);
	});

	it("should respond with the first matching action mapping", async function test( ) {
		await seedDatabase([
			{ codeword: 31415, actionId: "hay" },
			{ codeword: 27182, actionId: "hay" },
			{ codeword: 42, actionId: "needle" },
			{ codeword: 16180, actionId: "hay" },
		]);
		await api.get("/actions/42").expect(200, {
			codeword: 42,
			actionId: "needle",
		});
	});

});
