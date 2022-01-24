import { api } from "../../tests/api/application.js";

describe("GET /actions/:codeword", function endpointSuite( ) {

	it("should 404 if the codeword is invalid", async function test( ) {
		await Promise.all([
			api.get("/actions/foo").expect(404),
			api.get("/actions/-1").expect(404),
			api.get("/actions/3.1415").expect(404),
		]);
	});

	it("should respond with placeholder data", async function test( ) {
		await api.get("/actions/1234").expect(200, [ {
			codeword: 1234,
			id: "thanks!",
		} ]);
	});

});
