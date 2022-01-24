module.exports = {
	root: true,
	parserOptions: { ecmaVersion: 2022 },
	extends: [ "@brooswajne" ],

	overrides: [ {
		files: [ "routes/**/*" ],
		rules: {
			// allow http method handlers to have capital letters
			"new-cap": [ "error", { "capIsNewExceptions": [
				"DELETE",
				"GET",
				"PATCH",
				"POST",
				"PUT",
			] } ],
			// allow square-brackets in route files (for route params), and enforce
			// that all files are one of:
			// - *.js: actual api endpoints
			// - *.unit.test.js: unit tests for the corresponding api endpoint
			// - *.api.test.js: end-to-end api tests for the corresponding endpoint
			"filename-rules/match": [ "error", /^[[\]a-z]+(?:\.(?:unit|api)\.test)?\.js$/ ],
		},
	}, {
		files: [ "**/*.test.js" ],
		extends: [ "@brooswajne/eslint-config/overrides/mocha" ],
		// TODO: add these to my shared eslint config mocha override
		rules: {
			// each describe() and it() gets counted as an extra level of callback
			// nesting, but we want to allow those
			"max-nested-callbacks": "off",
			// the exact number of something which we expect isn't magic
			"no-magic-numbers": "off",
			// a single describe() might be verrryyy long
			"max-lines-per-function": "off",
		},
	} ],

};
