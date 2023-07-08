import { AST_NODE_TYPES, TSESLint } from '@typescript-eslint/utils'

type MessageIds = 'noInlineStyles'

function checkForDynamicValue(properties: any): boolean {
	return properties.some((property: any) => {
		if (property.value.type === 'Literal') return true

		if (
			property.value.type === 'TemplateLiteral' &&
			property.value.expressions.length === 0
		)
			return true

		return false
	})
}

export const noInlineStyle: TSESLint.RuleModule<MessageIds> = {
	defaultOptions: [],
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
				if (node.name.name !== 'style') return

				if (!node.value) return

				if (node.value.type !== AST_NODE_TYPES.JSXExpressionContainer) return

				let showError

				if (node.value.expression.type === AST_NODE_TYPES.ObjectExpression) {
					showError = checkForDynamicValue(node.value.expression.properties)
				} else if (
					node.value.expression.type === AST_NODE_TYPES.ConditionalExpression
				) {
					showError = true
				}

				if (showError) {
					context.report({
						node: node,
						messageId: 'noInlineStyles',
					})
				}
			},
		}
	},
}
