import { expect } from "chai";
import { fake } from "sinon";

import { getDatabaseEntriesIterator } from "./database.js";

describe("server/database.js", function fileSuite( ) {

	describe("getDatabaseEntriesIterator()", function functionSuite( ) {

		it("should yield all entries in the given database", async function test( ) {
			const read = fake.resolves(`[
				{ "entry": "one" },
				{ "entry": "two" }
			]`);

			const iterator = getDatabaseEntriesIterator("my-database.json", { read });
			expect(iterator).to.have.property(Symbol.asyncIterator);

			const entries = [ ];
			for await (const entry of iterator[ Symbol.asyncIterator ]( )) entries.push(entry);
			expect(entries).to.deep.equal([
				{ entry: "one" },
				{ entry: "two" },
			]);

			expect(read).to.have.been.calledOnceWith("my-database.json");
		});

		it("should validate that the database is in the expected format", async function test( ) {
			const read = fake.resolves("{ \"not an array\": true }");

			await expect((async function iterate( ) {
				const iterator = getDatabaseEntriesIterator("my-database.json", { read });
				// eslint-disable-next-line no-unused-vars -- just need to get the iterator going
				for await (const _ of iterator) expect.fail("Something was yielded");
			})( )).to.be.rejectedWith(Error, /not an array/i);
		});

	});

});
