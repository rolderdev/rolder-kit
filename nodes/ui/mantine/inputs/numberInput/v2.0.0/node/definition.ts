import { getPortDef, sizes } from '@shared/port-v1.0.0';
import type { ReactNodeDef, BaseReactProps } from '@shared/node-v1.0.0';
import { lazy } from 'react';

export type Props = BaseReactProps & { defaultValue?: string | number };

export default {
	hashTag: '#expreimental',
	module: { dynamic: lazy(() => import('../component/NumberInput')) },
	inNode: {
		inputs: [
			getPortDef({ name: 'label', displayName: 'Label', group: 'Params', type: 'string' }),
			getPortDef({ name: 'placeholder', displayName: 'Placeholder', group: 'Params', type: 'string' }),
			getPortDef({ name: 'description', displayName: 'Description', group: 'Params', type: 'string' }),
			getPortDef({ name: 'hideControls', displayName: 'Hide controls', group: 'Params', type: 'boolean', default: false }),
			getPortDef({ name: 'min', displayName: 'Min', group: 'Params', type: 'number' }),
			getPortDef({ name: 'max', displayName: 'Max', group: 'Params', type: 'number' }),
			getPortDef({ name: 'step', displayName: 'Step', group: 'Params', type: 'number' }),
			getPortDef({ name: 'defaultValue', displayName: 'Default value', group: 'Data', type: 'number' }),
			getPortDef({ name: 'w', displayName: 'Width', group: 'Dimensions', type: 'string' }),
			getPortDef({ name: 'size', displayName: 'Size', group: 'Dimensions', type: sizes, default: 'sm' }),
			getPortDef({
				name: 'variant',
				displayName: 'Variant',
				group: 'Styles',
				type: [
					{ value: 'default', label: 'Default' },
					{ value: 'filled', label: 'Filled' },
					{ value: 'unstyled', label: 'Unstyled' },
				],
				default: 'default',
			}),
			getPortDef({
				name: 'radius',
				displayName: 'Radius',
				group: 'Styles',
				type: [{ value: '0', label: 'none' }, ...sizes],
				default: 'md',
			}),
			getPortDef({ name: 'withAsterisk', displayName: 'With asterisk', group: 'Styles', type: 'boolean', default: false }),
			getPortDef({ name: 'increment', displayName: 'Increment', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'decrement', displayName: 'Decrement', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'reset', displayName: 'Reset', group: 'Signals', type: 'signal' }),
		],
		outputs: [
			getPortDef({ name: 'value', displayName: 'Value', group: 'Data', type: 'number' }),
			getPortDef({ name: 'changed', displayName: 'Changed', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'reseted', displayName: 'Reseted', group: 'Signals', type: 'signal' }),
		],
	},
} satisfies ReactNodeDef;
