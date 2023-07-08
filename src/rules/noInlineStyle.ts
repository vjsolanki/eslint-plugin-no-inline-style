import { AST_NODE_TYPES, TSESLint } from '@typescript-eslint/utils'

type MessageIds = 'noInlineStyles'

function checkDynamicStyleValueInStyleObject(properties: any) {
	return properties.find((property: any) => {
		if (property.type === AST_NODE_TYPES.Property) {
			return (
				property.value.type === 'Literal' ||
				(property.value.type === 'TemplateLiteral' &&
					property.value.expressions.length === 0)
			)
		}
		return null
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
			JSXElement(node) {
				const elementWithStyleAttribute = node.openingElement.attributes.find(
					attr => {
						return (
							attr.type === AST_NODE_TYPES.JSXAttribute &&
							attr.name.name === 'style'
						)
					}
				)

				if (
					elementWithStyleAttribute === undefined ||
					elementWithStyleAttribute === null
				)
					return

				if (elementWithStyleAttribute.type === AST_NODE_TYPES.JSXAttribute) {
					if (
						elementWithStyleAttribute.value &&
						elementWithStyleAttribute.value.type ===
							AST_NODE_TYPES.JSXExpressionContainer
					) {
						let element

						if (
							elementWithStyleAttribute.value.expression.type ===
							AST_NODE_TYPES.ObjectExpression
						) {
							element = checkDynamicStyleValueInStyleObject(
								elementWithStyleAttribute.value.expression.properties
							)
						} else if (
							elementWithStyleAttribute.value.expression.type ===
							AST_NODE_TYPES.ConditionalExpression
						) {
							element = elementWithStyleAttribute
						}

						if (element) {
							context.report({
								node: elementWithStyleAttribute,
								messageId: 'noInlineStyles',
							})
						}
					}
				}
			},
		}
	},
}
