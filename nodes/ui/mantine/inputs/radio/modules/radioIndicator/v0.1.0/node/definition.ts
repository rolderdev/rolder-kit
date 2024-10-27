import type { BaseReactProps, ReactNodeDef } from '@shared/node-v1.0.0'
import { getPortDef, sizes } from '@shared/port-v1.0.0'

export type Props = BaseReactProps & { inCard: boolean; checkedProp?: boolean }

import Comp from '../component/RadioIndicator'

export default {
	hashTag: '#expreimental',
	module: { static: Comp },
	inNode: {
		inputs: [
			getPortDef({ name: 'inCard', displayName: 'In RadioCard', group: 'Params', type: 'boolean', default: false }),
			getPortDef({
				name: 'checkedProp',
				displayName: 'Checked',
				group: 'States',
				type: 'boolean',
				dependsOn: (p: Props) => !p.inCard,
			}),
			getPortDef({ name: 'disabled', displayName: 'Disabled', group: 'States', type: 'boolean', default: false }),
			getPortDef({ name: 'size', displayName: 'Size', group: 'Dimensions', type: sizes, default: 'sm' }),
			getPortDef({
				name: 'variant',
				displayName: 'Variant',
				group: 'Styles',
				type: [
					{ value: 'filled', label: 'Filled' },
					{ value: 'outline', label: 'Outline' },
				],
				default: 'filled',
			}),
			getPortDef({ name: 'color', displayName: 'Color', group: 'Styles', type: 'string', default: 'blue' }),
			getPortDef({ name: 'iconColor', displayName: 'Icon color', group: 'Styles', type: 'string' }),
			getPortDef({
				name: 'radius',
				displayName: 'Radius',
				group: 'Styles',
				type: [{ value: '0', label: 'none' }, ...sizes],
				default: 'xl',
			}),
		],
	},
} satisfies ReactNodeDef
