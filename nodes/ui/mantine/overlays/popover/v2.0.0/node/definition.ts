import { getPortDef, sizes } from '@shared/port-v1.0.0';
import type { ReactNodeDef, BaseReactProps } from '@shared/node-v1.0.0';
import type { TooltipProps } from '@mantine/core';

export type Props = BaseReactProps & {
	useCustomOffset: boolean;
	numberOffset?: number;
	customOffset?: TooltipProps['offset'];
	dropdownProps?: any;
};

const positions = [
	{ label: 'Bottom', value: 'bottom' },
	{ label: 'Bottom start', value: 'bottom-start' },
	{ label: 'Bottom end', value: 'bottom-end' },
	{ label: 'Left', value: 'left' },
	{ label: 'Left start', value: 'left-start' },
	{ label: 'Left end', value: 'left-end' },
	{ label: 'Right', value: 'right' },
	{ label: 'Right start', value: 'right-start' },
	{ label: 'Right end', value: 'right-end' },
	{ label: 'Top', value: 'top' },
	{ label: 'Top start', value: 'top-start' },
	{ label: 'Top end', value: 'top-end' },
];

import Comp from '../component/Popover';

export default {
	hashTag: '#pre-release',
	module: { static: Comp },
	inNode: {
		inputs: [
			getPortDef({
				name: 'trapFocus',
				displayName: 'Trap focus',
				group: 'Params',
				type: 'boolean',
				default: false,
			}),
			getPortDef({
				name: 'closeOnClickOutside',
				displayName: 'Close on click outside',
				group: 'Params',
				type: 'boolean',
				default: true,
			}),
			getPortDef({
				name: 'position',
				displayName: 'Position',
				group: 'Layout',
				type: positions,
				default: 'top',
			}),
			getPortDef({
				name: 'useCustomOffset',
				displayName: 'Custom offset',
				group: 'Layout',
				type: 'boolean',
				default: false,
			}),
			getPortDef({
				name: 'numberOffset',
				displayName: 'Offset',
				group: 'Layout',
				type: 'number',
				default: 8,
				dependsOn: (p: Props) => !p.useCustomOffset,
			}),
			getPortDef({
				name: 'customOffset',
				displayName: 'Offset',
				group: 'Layout',
				type: 'objectEval',
				codeComment: `//() => ({ mainAxis: 5, crossAxis: 0 })`,
				dependsOn: (p: Props) => p.useCustomOffset,
			}),
			getPortDef({
				name: 'w',
				displayName: 'Width',
				group: 'Dimensions',
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
				name: 'shadow',
				displayName: 'Shadow',
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
				default: 7,
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
				name: 'disabled',
				displayName: 'Disabled',
				group: 'States',
				type: 'boolean',
				default: false,
			}),
			getPortDef({
				name: 'dropdownProps',
				displayName: 'Dropdown props',
				group: 'Advanced',
				type: 'objectEval',
				codeComment: `//() => ({ p: 0 })`,
			}),
			getPortDef({
				name: 'middlewares',
				displayName: 'Middlewares',
				group: 'Advanced',
				type: 'objectEval',
				codeComment: `//() => ({ flip: true, shift: true, inline: true })`,
			}),
			getPortDef({
				name: 'clickOutsideEvents',
				displayName: 'Click outside events',
				group: 'Advanced',
				type: 'array',
				codeComment: `//['mouseup', 'touchend']`,
				dependsOn: (p) => p.closeOnClickOutside,
			}),
			getPortDef({ name: 'open', displayName: 'Open', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'close', displayName: 'Close', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'toggle', displayName: 'Toggle', group: 'Signals', type: 'signal' }),
		],
		outputs: [
			getPortDef({ name: 'opened', displayName: 'Opened', group: 'States', type: 'boolean' }),
			getPortDef({ name: 'closed', displayName: 'Closed', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'state', displayName: 'State', group: 'States', type: 'boolean' }),
		],
	},
} satisfies ReactNodeDef;
