module.exports = {
	root: true,
	parserOptions: { ecmaVersion: 2022 },
	extends: [ "@brooswajne" ],

	overrides: [ {
		files: [ "routes/**/*" ],
		// allow square-brackets in route files (for route params), and enforce
		// that all files are js
		rules: { "filename-rules/match": [ "error", /^[a-z[\]]+\.js$/ ] },
	} ],

};
