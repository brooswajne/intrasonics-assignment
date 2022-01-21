module.exports = {
	root: true,
	parserOptions: { ecmaVersion: 2022 },
	extends: [ "@brooswajne" ],

	overrides: [ {
		files: [ "routes/**/*" ],
		// allow square-brackets in route files (for route params), and enforce
		// that all files are js
		rules: { "filename-rules/match": [ "error", /^[[\]a-z]+\.js$/ ] },
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
