import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort, getPorts } from '@packages/port'

import v100 from '@packages/text-v1.0.0'
import v101 from '@packages/text-v1.0.1'
import v102 from '@packages/text-v1.0.2'

export default reactNode('Text', {
	'v1.0.0': {
		module: { static: v100 },
		inputs: [
			...getPorts('input', [
				'customProps',
				'propsFunction',
				'useScope',
				'fz',
				'fw',
				'w',
				'h',
				'opacity',
				'inline',
				'fitContent',
				'ta',
				'textFormat',
				'textMask',
				'numberFormat',
				'dataSource',
				'itemSource',
				'sourceField',
				'valueSource',
			]),
			getPort({
				plug: 'input',
				name: 'scope',
				displayName: 'Scope',
				group: 'Scope',
				type: getCustomEnumType(['table']),
				default: 'table',
				customs: {
					required: 'connection',
					dependsOn(props) {
						return props.useScope ? true : false
					},
				},
			}),
			getPort({
				plug: 'input',
				name: 'dateFormatAtText',
				displayName: 'Date format',
				group: 'Params',
				type: 'string',
				default: 'YYYY.MM.DD',
				customs: {
					required: 'both',
					dependsOn(props) {
						return props.textFormat === 'date'
					},
				},
			}),
			getPort({
				plug: 'input',
				name: 'variant',
				displayName: 'Variant',
				group: 'Style',
				type: getCustomEnumType(['text', 'gradient']),
				default: 'text',
			}),
			getPort({
				plug: 'input',
				name: 'color',
				displayName: 'Color',
				group: 'Style',
				type: 'string',
				customs: {
					dependsOn(p) {
						return p.variant === 'text'
					},
				},
			}),
			getPort({
				plug: 'input',
				name: 'gradient',
				displayName: 'Gradient',
				group: 'Style',
				type: 'array',
				customs: {
					isObject: true,
					dependsOn(p) {
						return p.variant === 'gradient'
					},
				},
			}),
		],
	},
	'v1.0.1': {
		module: { static: v101 },
		inputs: [
			...getPorts('input', [
				'customProps',
				'propsFunction',
				'useScope',
				'fz',
				'fw',
				'w',
				'h',
				'opacity',
				'inline',
				'fitContent',
				'ta',
				'textFormat',
				'textMask',
				'numberFormat',
				'dataSource',
				'itemSource',
				'sourceField',
				'valueSource',
			]),
			getPort({
				plug: 'input',
				name: 'scope',
				displayName: 'Scope',
				group: 'Scope',
				type: getCustomEnumType(['table']),
				default: 'table',
				customs: {
					required: 'connection',
					dependsOn(props) {
						return props.useScope ? true : false
					},
				},
			}),
			getPort({
				plug: 'input',
				name: 'dateFormatAtText',
				displayName: 'Date format',
				group: 'Params',
				type: 'string',
				default: 'YYYY.MM.DD',
				customs: {
					required: 'both',
					dependsOn(props) {
						return props.textFormat === 'date'
					},
				},
			}),
			getPort({
				plug: 'input',
				name: 'variant',
				displayName: 'Variant',
				group: 'Style',
				type: getCustomEnumType(['text', 'gradient']),
				default: 'text',
			}),
			getPort({
				plug: 'input',
				name: 'color',
				displayName: 'Color',
				group: 'Style',
				type: 'string',
				customs: {
					dependsOn(p) {
						return p.variant === 'text'
					},
				},
			}),
			getPort({
				plug: 'input',
				name: 'gradient',
				displayName: 'Gradient',
				group: 'Style',
				type: 'array',
				customs: {
					isObject: true,
					dependsOn(p) {
						return p.variant === 'gradient'
					},
				},
			}),
		],
	},
	'v1.0.2': {
		module: { static: v102 },
		inputs: [
			...getPorts('input', [
				'customProps',
				'propsFunction',
				'useScope',
				'fz',
				'fw',
				'w',
				'h',
				'opacity',
				'inline',
				'fitContent',
				'ta',
				'textFormat',
				'textMask',
				'numberFormat',
				'dataSource',
				'itemSource',
				'sourceField',
				'valueSource',
			]),
			getPort({
				plug: 'input',
				name: 'scope',
				displayName: 'Scope',
				group: 'Scope',
				type: getCustomEnumType(['table']),
				default: 'table',
				customs: {
					required: 'connection',
					dependsOn(props) {
						return props.useScope ? true : false
					},
				},
			}),
			getPort({
				plug: 'input',
				name: 'dateFormatAtText',
				displayName: 'Date format',
				group: 'Params',
				type: 'string',
				default: 'YYYY.MM.DD',
				customs: {
					required: 'both',
					dependsOn(props) {
						return props.textFormat === 'date'
					},
				},
			}),
			getPort({
				plug: 'input',
				name: 'variant',
				displayName: 'Variant',
				group: 'Style',
				type: getCustomEnumType(['text', 'gradient']),
				default: 'text',
			}),
			getPort({
				plug: 'input',
				name: 'color',
				displayName: 'Color',
				group: 'Style',
				type: 'string',
				customs: {
					dependsOn(p) {
						return p.variant === 'text'
					},
				},
			}),
			getPort({
				plug: 'input',
				name: 'gradient',
				displayName: 'Gradient',
				group: 'Style',
				type: 'array',
				customs: {
					isObject: true,
					dependsOn(p) {
						return p.variant === 'gradient'
					},
				},
			}),
		],
	},
})
