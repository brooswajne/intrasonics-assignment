import { expect } from "chai";
import { fake } from "sinon";

import { createFileBasedRouter } from "./routing.js";

describe("server/routing.js", function fileSuite( ) {

	describe("createFileBasedRouter()", function functionSuite( ) {

		it("should traverse all files in the given directory", async function test( ) {
			const readdir = fake(async function readdir(dir) {
				// mock a filesystem which looks like this:
				// - root
				// -- directory1
				// -- directory2
				// ---- directory2.1
				// ----- file2.1.1
				// --- file2.1
				// --- file2.2
				// -- directory3
				switch (dir) {
				case "root": return [
					{ name: "directory1", isDirectory: ( ) => true },
					{ name: "directory2", isDirectory: ( ) => true },
					{ name: "directory3", isDirectory: ( ) => true },
				];
				case "root/directory1": return [];
				case "root/directory2": return [
					{ name: "directory2.1", isDirectory: ( ) => true },
					{ name: "file2.1", isDirectory: ( ) => false },
					{ name: "file2.2", isDirectory: ( ) => false },
				];
				case "root/directory2/directory2.1": return [
					{ name: "file2.1.1", isDirectory: ( ) => false },
				];
				case "root/directory3": return [];
				default: throw new Error(`Unexpected directory read: ${dir}`);
				}
			});

			await createFileBasedRouter("root", {
				// @ts-expect-error -- this is just a stub implementation
				readdir,
			});

			expect(readdir).to.have.callCount(5);
			const directoriesRead = readdir.getCalls( )
				.map((call) => call.args[ 0 ]);
			expect(directoriesRead).to.have.members([
				"root",
				"root/directory1",
				"root/directory2",
				"root/directory2/directory2.1",
				"root/directory3",
			]);
		});

		it("should import a file it encounters iff it is a .js file", async function test( ) {
			const importer = fake.resolves({ });

			await createFileBasedRouter("root", {
				// @ts-expect-error -- this is just a stub implementation
				readdir: fake.resolves([
					// TODO: make a function to generate these without needing to tell
					//       typescript to calm down each time
					// @ts-expect-error -- this is just a stub implementation
					{ name: "no-extension", isDirectory: ( ) => false },
					// @ts-expect-error -- this is just a stub implementation
					{ name: "javascript.js", isDirectory: ( ) => false },
					// @ts-expect-error -- this is just a stub implementation
					{ name: "not-js.dll", isDirectory: ( ) => false },
				]),
				importer: importer,
			});

			expect(importer).to.have.been.calledOnceWithExactly("root/javascript.js");
		});

		it("should register routes for any exported http handlers", async function test( ) {
			const handlers = {
				DELETE: ( ) => ({ }),
				GET: ( ) => ({ }),
				PATCH: ( ) => ({ }),
				POST: ( ) => ({ }),
				PUT: ( ) => ({ }),
				notAnHttpMethod: ( ) => ({ }),
			};
			const importer = fake.resolves(handlers);
			const router = {
				delete: fake( ),
				get: fake( ),
				patch: fake( ),
				post: fake( ),
				put: fake( ),
			};

			await createFileBasedRouter("root", {
				// @ts-expect-error -- this is just a stub implementation
				readdir: fake.resolves([ { name: "file.js", isDirectory: ( ) => false } ]),
				importer: importer,
				// @ts-expect-error -- this is just a stub implementation
				router: router,
			});

			expect(importer).to.have.been.calledOnceWithExactly("root/file.js");
			expect(router.delete).to.have.been.calledOnceWithExactly("/file", handlers.DELETE);
			expect(router.get).to.have.been.calledOnceWithExactly("/file", handlers.GET);
			expect(router.patch).to.have.been.calledOnceWithExactly("/file", handlers.PATCH);
			expect(router.post).to.have.been.calledOnceWithExactly("/file", handlers.POST);
			expect(router.put).to.have.been.calledOnceWithExactly("/file", handlers.PUT);
		});

		it("should turn square brackets into route parameters", async function test( ) {
			const router = { get: fake( ) };

			await createFileBasedRouter("root", {
				// @ts-expect-error -- this is just a stub implementation
				readdir: fake.resolves([
					// @ts-expect-error -- this is just a stub implementation
					{ name: "/file/with/[param].js", isDirectory: ( ) => false },
				]),
				importer: fake.resolves({ GET: ( ) => ({ }) }),
				// @ts-expect-error -- this is just a stub implementation
				router: router,
			});

			expect(router.get).to.have.been.calledOnceWith("/file/with/:param");
		});

	});

});
