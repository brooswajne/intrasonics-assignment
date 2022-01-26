import { expect } from "chai";

import { api } from "../tests/api/application.js";
import { seedDatabase } from "../tests/api/database.js";

describe("GET /actions", function endpointSuite( ) {

	it("should 400 if the filter is invalid", async function test( ) {
		const expectedStatus = 400;
		/** @param {any} filter */
		const testCase = async (filter, description = `with filter ${JSON.stringify(filter)}`) => {
			const { status } = await api.get("/actions").query(filter);
			expect(status, description).to.equal(expectedStatus);
		};
		await Promise.all([
			testCase({ foo: "bar" }, "unknown fields"),
			testCase({ codeword: "not a number" }),
			testCase({ actionId: [ "not", "a", "string" ] }),
		]);
	});

	it("should respond with all matching action mappings", async function test( ) {
		await seedDatabase([
			{ codeword: 31415, actionId: "hay" },
			{ codeword: 27182, actionId: "hay" },
			{ codeword: 42, actionId: "needle" },
			{ codeword: 16180, actionId: "hay" },
		]);

		// filter by action id
		await api.get("/actions").query({ actionId: "hay" }).expect(200, [
			{ codeword: 31415, actionId: "hay" },
			{ codeword: 27182, actionId: "hay" },
			{ codeword: 16180, actionId: "hay" },
		]);

		// filter by codeword
		await api.get("/actions").query({ codeword: "42" }).expect(200, [
			{ codeword: 42, actionId: "needle" },
		]);


		// no filter, everything matches
		await api.get("/actions").expect(200, [
			{ codeword: 31415, actionId: "hay" },
			{ codeword: 27182, actionId: "hay" },
			{ codeword: 42, actionId: "needle" },
			{ codeword: 16180, actionId: "hay" },
		]);

		// nothing matches, returns an empty array
		await api.get("/actions").query({ actionId: "diamond" })
			.expect(200, [ ]);
	});

});
