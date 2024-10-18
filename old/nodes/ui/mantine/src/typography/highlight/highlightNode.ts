import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort, getPorts } from '@packages/port'

import v100 from '@packages/highlight-v1.0.0'

export default reactNode('Highlight', {
	'v1.0.0': {
		module: { static: v100 },
		inputs: [
			...getPorts('input', [
				'customProps',
				'propsFunction',
				'useScope',
				'fz',
				'fw',
				'color',
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
				'highlight',
				'highlightColor',
				'highlightStyles',
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
		],
	},
})
