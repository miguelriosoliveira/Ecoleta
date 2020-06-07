module.exports = {
	env: {
		es2020: true,
	},
	extends: [
		'plugin:react/recommended',
		'airbnb',
		'plugin:@typescript-eslint/recommended',
		'prettier/@typescript-eslint',
		'plugin:prettier/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 11,
		sourceType: 'module',
	},
	plugins: [
		'react',
		'react-hooks',
		'@typescript-eslint',
		'prettier',
		'eslint-plugin-import-helpers',
	],
	rules: {
		camelcase: 'off',
		'no-unused-expressions': 'off',

		'@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
		'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never' }],
		'import-helpers/order-imports': [
			'error',
			{
				newlinesBetween: 'always',
				groups: ['/^react/', 'module', 'parent', 'sibling', 'index'],
				alphabetize: { order: 'asc', ignoreCase: true },
			},
		],
		'import/prefer-default-export': 'off',
		'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
		'prettier/prettier': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'react-hooks/rules-of-hooks': 'error',
		'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
		'react/jsx-indent': ['error', 'tab', { checkAttributes: true, indentLogicalExpressions: true }],
		'react/jsx-indent-props': ['warn', 'tab'],
		'react/jsx-props-no-spreading': 'off',
		'react/prop-types': 'off',
	},
	settings: {
		'import/resolver': {
			typescript: {},
		},
	},
};
