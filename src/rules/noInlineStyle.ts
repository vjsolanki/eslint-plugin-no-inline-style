import type { Rule } from 'eslint'

export const noInlineStyle: Rule.RuleModule = {
	meta: {
		type: 'problem',
	},
	create(context) {
		return {
			JSXElement(node) {
				if (node.openingElement.attributes.length) {
					const doesInlineStyleExist = node.openingElement.attributes.find(
						attr => attr.name.name === 'style'
					)
					let showWarning = Boolean(doesInlineStyleExist)

					if (doesInlineStyleExist.value.type === 'JSXExpressionContainer') {
						const variableName = doesInlineStyleExist.value.expression.properties.find(
							p => p.value.type === 'Literal'
						)

						if (variableName) {
							context.report({
								node: doesInlineStyleExist,
								message: 'Inline Style is not allowed',
							})
						}
					}
				}
			},
		}
	},
}
