import type { Rule } from 'eslint';

type MessageIds = 'noInlineStyles';

function checkForDynamicValue(properties: any): boolean {
	return properties.some((property: any) => {
		if (property.value.type === 'Literal') return true;

		if (
			property.value.type === 'TemplateLiteral' &&
			property.value.expressions.length === 0
		)
			return true;

		return false;
	});
}

export const noInlineStyle: Rule.RuleModule = {
	meta: {
		type: 'problem',
		messages: {
			noInlineStyles: 'Inline Style is not allowed',
		},
		schema: [],
	},
	create(context) {
		return {
			JSXAttribute(node) {
				if (node.name.name !== 'style') return;

				if (!node.value) return;

				if (node.value.type !== 'JSXExpressionContainer') return;

				let showError;

				if (node.value.expression.type === 'ObjectExpression') {
					showError = checkForDynamicValue(node.value.expression.properties);
				} else if (node.value.expression.type === 'ConditionalExpression') {
					showError = true;
				}

				if (showError) {
					context.report({
						node: node,
						messageId: 'noInlineStyles',
					});
				}
			},
		};
	},
};
