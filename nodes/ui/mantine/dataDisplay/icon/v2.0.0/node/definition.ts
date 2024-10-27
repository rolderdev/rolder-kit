import type { ThemeIconVariant } from '@mantine/core'
import type { BaseReactProps, ReactNodeDef } from '@shared/node-v1.0.0'
import { getPortDef, sizes } from '@shared/port-v1.0.0'
import type { Icons } from 'shared'

export type Props = BaseReactProps & {
	type: 'icon' | 'themeIcon'
	name?: keyof Icons
	variant: ThemeIconVariant
	stroke?: number
	iconSize?: number
	iconThemeSize?: number
	iconColor?: string
	themeColor?: string
	disabled: boolean
}

import Comp from '../component/Icon'

export default {
	hashTag: '#expreimental',
	module: { static: Comp },
	inNode: {
		inputs: [
			getPortDef({
				name: 'type',
				displayName: 'Type',
				group: 'Params',
				type: [
					{ value: 'icon', label: 'Icon' },
					{ value: 'themeIcon', label: 'Theme icon' },
				],
				default: 'icon',
			}),
			getPortDef({ name: 'name', displayName: 'Icon name', group: 'Params', type: 'string' }),
			getPortDef({
				name: 'size',
				displayName: 'Size',
				group: 'Dimensions',
				type: sizes,
				default: 'md',
				dependsOn: (p: Props) => p.type === 'themeIcon',
			}),
			getPortDef({
				name: 'iconSize',
				displayName: 'Icon size',
				group: 'Dimensions',
				type: 'number',
				default: 24,
				dependsOn: (p: Props) => p.type === 'icon',
			}),
			getPortDef({
				name: 'iconThemeSize',
				displayName: 'Icon size',
				group: 'Dimensions',
				type: 'number',
				default: 20,
				dependsOn: (p: Props) => p.type === 'themeIcon',
			}),
			getPortDef({
				name: 'variant',
				displayName: 'Variant',
				group: 'Styles',
				type: [
					{ value: 'filled', label: 'Filled' },
					{ value: 'light', label: 'Light' },
					{ value: 'outline', label: 'Outline' },
					{ value: 'default', label: 'Default' },
					{ value: 'white', label: 'White' },
					{ value: 'gradient', label: 'Gradient' },
				],
				default: 'filled',
				dependsOn: (p: Props) => p.type === 'themeIcon',
			}),
			getPortDef({
				name: 'gradient',
				displayName: 'Gradient',
				group: 'Styles',
				type: 'objectEval',
				dependsOn: (p: Props) => p.variant === 'gradient',
				codeComment: `//(props) => { return { from: 'blue', to: 'cyan', deg: 90 } }`,
			}),
			getPortDef({
				name: 'radius',
				displayName: 'Radius',
				group: 'Styles',
				type: sizes,
				default: 'md',
				dependsOn: (p: Props) => p.type === 'themeIcon',
			}),
			getPortDef({
				name: 'iconColor',
				displayName: 'Color',
				group: 'Styles',
				type: 'string',
				dependsOn: (p: Props) => p.type === 'icon',
			}),
			getPortDef({
				name: 'themeColor',
				displayName: 'Color',
				group: 'Styles',
				type: 'string',
				default: 'blue',
				dependsOn: (p: Props) => p.type === 'themeIcon' && p.variant !== 'gradient',
			}),
			getPortDef({ name: 'stroke', displayName: 'Stroke', group: 'Styles', type: 'number', default: 2 }),
			getPortDef({ name: 'disabled', displayName: 'Disabled', group: 'States', type: 'boolean', default: false }),
		],
	},
	disableCustomProps: true,
} satisfies ReactNodeDef
