import { getPortDef, sizes } from '@shared/port-v1.0.0';
import type { ReactNodeDef, BaseReactProps } from '@shared/node-v1.0.0';
import type { TooltipProps } from '@mantine/core';

export type Props = BaseReactProps & {
	label: string;
	useCustomOffset: boolean;
	numberOffset?: number;
	customOffset?: TooltipProps['offset'];
	hoverEvent: boolean;
	focusEvent: boolean;
	touchEvent: boolean;
	floating: boolean;
};

const positions = [
	{ label: 'Top', value: 'top' },
	{ label: 'Top start', value: 'top-start' },
	{ label: 'Top end', value: 'top-end' },
	{ label: 'Right', value: 'right' },
	{ label: 'Right start', value: 'right-start' },
	{ label: 'Right end', value: 'right-end' },
	{ label: 'Bottom', value: 'bottom' },
	{ label: 'Bottom start', value: 'bottom-start' },
	{ label: 'Bottom end', value: 'bottom-end' },
	{ label: 'Left', value: 'left' },
	{ label: 'Left start', value: 'left-start' },
	{ label: 'Left end', value: 'left-end' },
];

import Comp from '../component/Tooltip';

export default {
	module: { static: Comp },
	inNode: {
		inputs: [
			getPortDef({
				name: 'label',
				displayName: 'Label',
				group: 'Params',
				type: 'string',
				validate: (p: Props) => (p.label ? true : false),
			}),
			getPortDef({
				name: 'position',
				displayName: 'Position',
				group: 'Layout',
				type: positions,
				default: 'top',
			}),
			getPortDef({
				name: 'multiline',
				displayName: 'Multiline',
				group: 'Layout',
				type: 'boolean',
				default: false,
			}),
			getPortDef({
				name: 'floating',
				displayName: 'Floating',
				group: 'Layout',
				type: 'boolean',
				default: false,
			}),
			getPortDef({
				name: 'inline',
				displayName: 'Inline',
				group: 'Layout',
				default: 'top',
				type: positions,
			}),
			getPortDef({
				name: 'useCustomOffset',
				displayName: 'Custom offset',
				group: 'Layout',
				type: 'boolean',
				default: false,
				dependsOn: (p: Props) => !p.floating && !p.useCustomOffset,
			}),
			getPortDef({
				name: 'numberOffset',
				displayName: 'Offset',
				group: 'Layout',
				type: 'number',
				default: 5,
				dependsOn: (p: Props) => p.useCustomOffset,
			}),
			getPortDef({
				name: 'customOffset',
				displayName: 'Offset',
				group: 'Layout',
				type: 'objectEval',
				codeComment: `//() => ({ mainAxis: 5, crossAxis: 0 })`,
				dependsOn: (p: Props) => !p.floating && p.useCustomOffset,
			}),
			getPortDef({
				name: 'w',
				displayName: 'Width',
				group: 'Dimensions',
				type: 'string',
				dependsOn: (p) => p.multiline,
			}),
			getPortDef({
				name: 'color',
				displayName: 'Color',
				group: 'Styles',
				type: 'string',
			}),
			getPortDef({
				name: 'radius',
				displayName: 'Radius',
				group: 'Styles',
				type: sizes,
				default: 'md',
			}),
			getPortDef({
				name: 'withArrow',
				displayName: 'With arrow',
				group: 'Custom',
				customGroup: 'Arrow',
				type: 'boolean',
				default: true,
			}),
			getPortDef({
				name: 'arrowPosition',
				displayName: 'Position',
				group: 'Custom',
				customGroup: 'Arrow',
				type: [
					{ label: 'Center', value: 'center' },
					{ label: 'Side', value: 'side' },
				],
				default: 'center',
				dependsOn: (p) => p.withArrow,
			}),
			getPortDef({
				name: 'arrowOffset',
				displayName: 'Offset',
				group: 'Custom',
				customGroup: 'Arrow',
				type: 'number',
				default: 5,
				dependsOn: (p) => p.withArrow,
			}),
			getPortDef({
				name: 'arrowSize',
				displayName: 'Size',
				group: 'Custom',
				customGroup: 'Arrow',
				type: 'number',
				default: 4,
				dependsOn: (p) => p.withArrow,
			}),
			getPortDef({
				name: 'arrowRadius',
				displayName: 'Radius',
				group: 'Custom',
				customGroup: 'Arrow',
				type: 'number',
				default: 0,
				dependsOn: (p) => p.withArrow,
			}),
			getPortDef({
				name: 'hoverEvent',
				displayName: 'Hover',
				group: 'Custom',
				customGroup: 'Events',
				type: 'boolean',
				default: true,
			}),
			getPortDef({
				name: 'focusEvent',
				displayName: 'Focus',
				group: 'Custom',
				customGroup: 'Events',
				type: 'boolean',
				default: false,
			}),
			getPortDef({
				name: 'touchEvent',
				displayName: 'Touch',
				group: 'Custom',
				customGroup: 'Events',
				type: 'boolean',
				default: false,
			}),
		],
	},
} satisfies ReactNodeDef;
