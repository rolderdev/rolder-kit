import type { CheckboxVariant } from '@mantine/core'
import type { BaseReactProps, ReactNodeDef } from '@shared/node-v1.0.0'
import { getPortDef, sizes } from '@shared/port-v1.0.0'
import type { Icons } from 'shared'

export type Props = BaseReactProps & {
	inGroup: boolean
	checkedProp?: boolean
	indeterminateProp?: boolean
	variant: CheckboxVariant
	customIcons: { checked: keyof Icons; indeterminate: keyof Icons }
}

import Comp from '../component/Checkbox'

export default {
	hashTag: '#expreimental',
	module: { static: Comp },
	inNode: {
		inputs: [
			getPortDef({ name: 'inGroup', displayName: 'In CheckboxGroup', group: 'Params', type: 'boolean', default: false }),
			getPortDef({ name: 'value', displayName: 'Value', group: 'Params', type: 'string' }),
			getPortDef({ name: 'label', displayName: 'Label', group: 'Params', type: 'string' }),
			getPortDef({ name: 'description', displayName: 'Description', group: 'Params', type: 'string' }),
			getPortDef({
				name: 'error',
				displayName: 'Error',
				group: 'Params',
				type: '*',
				dependsOn: (p: Props) => !p.inGroup,
			}),
			getPortDef({
				name: 'checkedProp',
				displayName: 'Checked',
				group: 'States',
				type: 'boolean',
				default: false,
				dependsOn: (p: Props) => !p.inGroup,
			}),
			getPortDef({
				name: 'indeterminateProp',
				displayName: 'Indeterminate',
				group: 'States',
				type: 'boolean',
				default: false,
				dependsOn: (p: Props) => !p.inGroup,
			}),
			getPortDef({ name: 'disabled', displayName: 'Disabled', group: 'States', type: 'boolean', default: false }),
			getPortDef({
				name: 'labelPosition',
				displayName: 'Label position',
				group: 'Layout',
				type: [
					{ value: 'right', label: 'Right' },
					{ value: 'left', label: 'Left' },
				],
				default: 'right',
			}),
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
			getPortDef({
				name: 'iconColor',
				displayName: 'Icon color',
				group: 'Styles',
				type: 'string',
				dependsOn: (p: Props) => p.variant === 'filled',
			}),
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
		outputs: [
			getPortDef({
				name: 'checked',
				displayName: 'Checked',
				group: 'States',
				type: 'boolean',
				dependsOn: (p: Props) => !p.inGroup,
			}),
			getPortDef({
				name: 'indeterminate',
				displayName: 'Indeterminate',
				group: 'States',
				type: 'boolean',
				dependsOn: (p: Props) => !p.inGroup,
			}),
			getPortDef({
				name: 'changed',
				displayName: 'Changed',
				group: 'Signals',
				type: 'signal',
				dependsOn: (p: Props) => !p.inGroup,
			}),
		],
	},
} satisfies ReactNodeDef
