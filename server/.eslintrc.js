module.exports = {
	env: {
		es6: true,
		node: true,
	},
	extends: [
		'airbnb-base',
		'plugin:@typescript-eslint/recommended',
		'prettier/@typescript-eslint',
		'plugin:prettier/recommended',
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 11,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'prettier', 'eslint-plugin-import-helpers'],
	rules: {
		camelcase: 'off',
		'class-methods-use-this': 'off',
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '_' }],
		'import/extensions': ['error', 'ignorePackages', { ts: 'never' }],
		'import/prefer-default-export': 'off',
		'import-helpers/order-imports': [
			'error',
			{
				newlinesBetween: 'always',
				groups: ['module', 'parent', 'sibling', 'index'],
				alphabetize: { order: 'asc', ignoreCase: true },
			},
		],
		'prettier/prettier': 'error',
	},
	settings: { 'import/resolver': { typescript: {} } },
};
