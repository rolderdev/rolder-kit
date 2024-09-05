import { reactNode } from '@packages/node';
import { getPorts, getPort, getCustomEnumType } from '@packages/port';

import v100 from '@packages/anchor-v0.1.0';

export default reactNode('Anchor', {
	'v0.1.0': {
		module: { static: v100 },
		inputs: [
			...getPorts('input', ['dataSource', 'itemSource', 'sourceField', 'valueSource']),
			getPort({
				plug: 'input',
				name: 'linkFromItem',
				displayName: 'Use item',
				group: 'Link',
				type: 'boolean',
				default: false,
				customs: {
					dependsOn(props) {
						return props.dataSource === 'item';
					},
				},
			}),
			getPort({
				plug: 'input',
				name: 'linkField',
				displayName: 'Field',
				group: 'Link',
				type: 'string',
				customs: {
					required: 'connection',
					dependsOn(props) {
						return props.dataSource === 'item' && props.linkFromItem;
					},
				},
			}),
			getPort({
				plug: 'input',
				name: 'link',
				displayName: 'Link',
				group: 'Link',
				type: 'string',
				customs: {
					required: 'connection',
					dependsOn(props) {
						return !props.linkFromItem;
					},
				},
			}),
			getPort({
				plug: 'input',
				name: 'dateFormat',
				displayName: 'Date format',
				group: 'Params',
				type: 'string',
				default: 'YYYY.MM.DD',
				customs: {
					required: 'both',
					dependsOn(props) {
						return props.textFormat === 'date';
					},
				},
			}),
			getPort({
				plug: 'input',
				name: 'underline',
				displayName: 'Underline',
				group: 'Style',
				type: getCustomEnumType(['hover', 'always', 'never']),
				default: 'hover',
				customs: {
					dependsOn(p) {
						return p.variant === 'text';
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
				name: 'c',
				displayName: 'Color',
				group: 'Style',
				type: 'string',
				default: 'blue',
				customs: {
					dependsOn(p) {
						return p.variant === 'text';
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
						return p.variant === 'gradient';
					},
				},
			}),
			getPort({
				plug: 'input',
				name: 'truncate',
				displayName: 'Truncate',
				group: 'Font',
				type: getCustomEnumType(['disabled', 'end', 'start']),
				default: 'disabled',
			}),
			...getPorts('input', [
				'customProps',
				'propsFunction',
				'fz',
				'fw',
				'w',
				'h',
				'opacity',
				'inline',
				'ta',
				'textFormat',
				'textMask',
				'numberFormat',
			]),
		],
	},
});
