// This file performs any setup and teardown logic for unit tests.

import sinon from "sinon-chai";
import { use } from "chai";

export function mochaGlobalSetup( ) {
	use(sinon);
}
