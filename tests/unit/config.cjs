module.exports = {
	spec: "**/*.test.js",
	ignore: [
		"**/*.api.test.js",
		"node_modules/**/*",
	],
	require: "tests/unit/setup.js",
};
