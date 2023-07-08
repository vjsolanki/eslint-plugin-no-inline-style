import { ESLintUtils } from '@typescript-eslint/utils'
import { noInlineStyle } from '../rules/noInlineStyle'

const parserResolver = require.resolve('@typescript-eslint/parser')

const tester = new ESLintUtils.RuleTester({
	parser: parserResolver as any,
	parserOptions: {
		ecmaVersion: 2015,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
})

tester.run('no-invalid-jsx-nesting', noInlineStyle, {
	valid: [
		{ code: '<p>Hello world</p>' },
		{ code: '<p style>Hello world</p>' },
		{ code: '<p style="">Hello world</p>' },
		{ code: '<p style={{}}>Hello world</p>' },
		{ code: '<p style={{backgroundColor: color}}>Hello world</p>' },
		{ code: '<p style={{fontSize: `${size}px`}}>Hello world</p>' },
		{ code: '<p {...props}>Hello world</p>' },
	],
	invalid: [
		{
			code: '<p style={{color: "red"}}>Hello world</p>',
			errors: [
				{
					messageId: 'noInlineStyles',
				},
			],
		},
		{
			code: '<p style={{color: "red", fontSize: `${size}px`}}>Hello world</p>',
			errors: [
				{
					messageId: 'noInlineStyles',
				},
			],
		},
		{
			code:
				'<p style={isDesktop ? { marginTop: "-20px" } : null}>Hello world</p>',
			errors: [
				{
					messageId: 'noInlineStyles',
				},
			],
		},
		{
			code: '<p style={{fontSize: `24px`}}>Hello world</p>',
			errors: [
				{
					messageId: 'noInlineStyles',
				},
			],
		},
	],
})
