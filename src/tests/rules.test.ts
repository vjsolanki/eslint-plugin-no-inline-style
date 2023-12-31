import { RuleTester } from 'eslint';
import { noInlineStyle } from '../rules/noInlineStyle';

const tester = new RuleTester({
	parserOptions: {
		ecmaVersion: 2015,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
});
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
			code: '<p style={isDesktop ? { marginTop: "-20px" } : null}>Hello world</p>',
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
		{
			code:
				'<p style={{ width: isTabletScreen ? "max-content" : "100%" }}>Hello world</p>',
			errors: [
				{
					messageId: 'noInlineStyles',
				},
			],
		},
	],
});
