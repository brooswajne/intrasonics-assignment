import { expect } from "chai";
import { fake } from "sinon";

import { getDatabaseEntriesIterator } from "./database.js";

describe("server/database.js", function fileSuite( ) {

	describe("getDatabaseEntriesIterator()", function functionSuite( ) {

		it("should yield all entries in the given database and table", async function test( ) {
			const read = fake.resolves(`{
				"table": [
					{ "entry": "one" },
					{ "entry": "two" }
				],
				"other": [
					{ "entry": "three" }
				]
			}`);

			const iterator = getDatabaseEntriesIterator("my-database.json", "table", { read });
			expect(iterator).to.have.property(Symbol.asyncIterator);

			const entries = [ ];
			for await (const entry of iterator[ Symbol.asyncIterator ]( )) entries.push(entry);
			expect(entries).to.deep.equal([
				{ entry: "one" },
				{ entry: "two" },
			]);

			expect(read).to.have.been.calledOnceWith("my-database.json");
		});

		it("should throw an error if the database is invalid", async function test( ) {
			const read = fake.resolves("[ \"not valid\" ]");

			await expect((async function iterate( ) {
				const iterator = getDatabaseEntriesIterator("my-database.json", "table", { read });
				// eslint-disable-next-line no-unused-vars -- just need to get the iterator going
				for await (const _ of iterator) expect.fail("Something was yielded");
			})( )).to.be.rejectedWith(Error, /invalid database/i);
		});

		it("should throw an error if the table doesn't exist", async function test( ) {
			const read = fake.resolves("{ \"table\": [ ] }");

			await expect((async function iterate( ) {
				const iterator = getDatabaseEntriesIterator("my-database.json", "nope", { read });
				// eslint-disable-next-line no-unused-vars -- just need to get the iterator going
				for await (const _ of iterator) expect.fail("Something was yielded");
			})( )).to.be.rejectedWith(Error, /invalid database table/i);
		});

		it("should throw an error if the table is invalid", async function test( ) {
			const read = fake.resolves("{ \"table\": { \"not\": \"an array\" } }");

			await expect((async function iterate( ) {
				const iterator = getDatabaseEntriesIterator("my-database.json", "table", { read });
				// eslint-disable-next-line no-unused-vars -- just need to get the iterator going
				for await (const _ of iterator) expect.fail("Something was yielded");
			})( )).to.be.rejectedWith(Error, /invalid database table/i);
		});

	});

});
