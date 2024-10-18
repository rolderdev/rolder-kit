import type { BaseReactProps, ReactNodeDef } from '@shared/node-v1.0.0'
import { getPortDef, sizes } from '@shared/port-v1.0.0'
import type { Icons } from 'shared'

export type Props = BaseReactProps & {
	inCard: boolean
	checkedProp?: boolean
	indeterminateProp?: boolean
	customIcons: { checked: keyof Icons; indeterminate: keyof Icons }
}

import Comp from '../component/CheckboxIndicator'

export default {
	hashTag: '#expreimental',
	module: { static: Comp },
	inNode: {
		inputs: [
			getPortDef({ name: 'inCard', displayName: 'In CheckboxCard', group: 'Params', type: 'boolean', default: false }),
			getPortDef({
				name: 'checkedProp',
				displayName: 'Checked',
				group: 'States',
				type: 'boolean',
				dependsOn: (p: Props) => !p.inCard,
			}),
			getPortDef({
				name: 'indeterminateProp',
				displayName: 'Indeterminate',
				group: 'States',
				type: 'boolean',
				default: false,
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
				default: 'sm',
			}),
			getPortDef({
				name: 'customIcons',
				displayName: 'Custom icons',
				group: 'Advanced',
				type: 'objectEval',
				codeComment: `//() => ({ checked: 'IconX', indeterminate: 'IconRocket' })`,
				validate: (p: Props) => {
					if (p.customIcons && (!p.customIcons.checked || !p.customIcons.indeterminate))
						return `Wrong "Custom icons" format. Expect { checked: 'IconName', indeterminate: 'IconName' }, got: ${JSON.stringify(
							p.customIcons
						)}`
					return true
				},
			}),
		],
	},
} satisfies ReactNodeDef
