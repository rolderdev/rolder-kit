import { reactNode } from '@packages/node';
import { getPorts, getPort, getUnitType, getCustomEnumType } from '@packages/port';

import v010 from '@packages/tooltip-v0.1.0';

const positions = [
	'top',
	'top-start',
	'top-end',
	'right',
	'right-start',
	'right-end',
	'bottom',
	'bottom-start',
	'bottom-end',
	'left',
	'left-start',
	'left-end',
];

export default reactNode(
	'Tooltip',
	{
		'v0.1.0': {
			module: { static: v010 },
			inputs: [
				...getPorts('input', ['customProps', 'label', 'color', 'radius', 'inline']),
				getPort({
					plug: 'input',
					name: 'position',
					displayName: 'Position',
					group: 'Layout',
					default: 'top',
					type: getCustomEnumType(positions),
				}),
				getPort({
					plug: 'input',
					name: 'multiline',
					displayName: 'Multiline',
					group: 'Layout',
					type: 'boolean',
					default: false,
				}),
				getPort({
					plug: 'input',
					name: 'floating',
					displayName: 'Floating',
					group: 'Layout',
					type: 'boolean',
					default: false,
				}),
				getPort({
					plug: 'input',
					name: 'w',
					displayName: 'Width',
					group: 'Dimensions',
					type: getUnitType(['rem', 'px'], 'rem'),
					customs: {
						dependsOn(p) {
							return p.multiline ? true : false;
						},
					},
				}),
				getPort({
					plug: 'input',
					name: 'useCustomOffset',
					displayName: 'Custom offset',
					group: 'Layout',
					type: 'boolean',
					default: false,
					customs: {
						dependsOn(p) {
							return !p.floating && !p.useCustomOffset;
						},
					},
				}),
				getPort({
					plug: 'input',
					name: 'numberOffset',
					displayName: 'Offset',
					group: 'Layout',
					type: 'number',
					default: 5,
					customs: {
						dependsOn(p) {
							return p.useCustomOffset ? false : true;
						},
					},
				}),
				getPort({
					plug: 'input',
					name: 'customOffset',
					displayName: 'Offset',
					group: 'Layout',
					type: 'array',
					default: `[{ mainAxis: 5, crossAxis: 0 }]`,
					customs: {
						isObject: true,
						dependsOn(p) {
							return !p.floating && p.useCustomOffset;
						},
					},
				}),
				getPort({
					plug: 'input',
					name: 'withArrow',
					displayName: 'With arrow',
					group: 'Arrow',
					type: 'boolean',
					default: true,
				}),
				getPort({
					plug: 'input',
					name: 'arrowPosition',
					displayName: 'Position',
					group: 'Arrow',
					type: getCustomEnumType(['center', 'side']),
					default: 'center',
					customs: {
						dependsOn(p) {
							return p.withArrow ? true : false;
						},
					},
				}),
				getPort({
					plug: 'input',
					name: 'arrowOffset',
					displayName: 'Offset',
					group: 'Arrow',
					type: 'number',
					default: 5,
					customs: {
						dependsOn(p) {
							return p.withArrow ? true : false;
						},
					},
				}),
				getPort({
					plug: 'input',
					name: 'arrowSize',
					displayName: 'Szie',
					group: 'Arrow',
					type: 'number',
					default: 4,
					customs: {
						dependsOn(p) {
							return p.withArrow ? true : false;
						},
					},
				}),
				getPort({
					plug: 'input',
					name: 'arrowRadius',
					displayName: 'Radius',
					group: 'Arrow',
					type: 'number',
					default: 0,
					customs: {
						dependsOn(p) {
							return p.withArrow ? true : false;
						},
					},
				}),
				getPort({
					plug: 'input',
					name: 'hoverEvent',
					displayName: 'Hover',
					group: 'Events',
					type: 'boolean',
					default: true,
				}),
				getPort({
					plug: 'input',
					name: 'focusEvent',
					displayName: 'Focus',
					group: 'Events',
					type: 'boolean',
					default: false,
				}),
				getPort({
					plug: 'input',
					name: 'touchEvent',
					displayName: 'Touch',
					group: 'Events',
					type: 'boolean',
					default: false,
				}),
			],
		},
	},
	{ allowChildren: true }
);
