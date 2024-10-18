import type { ButtonVariant } from '@mantine/core'
import type { BaseReactProps, ReactNodeDef } from '@shared/node-v1.0.0'
import { getPortDef, sizes } from '@shared/port-v1.0.0'

export type Props = BaseReactProps & {
	label?: string
	submitType: boolean
	href?: string
	sizeProp: string
	compact: boolean
	fullWidth: boolean
	variant: ButtonVariant
	disabled: boolean
}

import Comp from '../component/Button'

export default {
	hashTag: '#expreimental',
	module: { static: Comp },
	inNode: {
		inputs: [
			getPortDef({ name: 'label', displayName: 'Label', group: 'Params', type: 'string' }),
			getPortDef({ name: 'submitType', displayName: 'Submit type', group: 'Params', type: 'boolean', default: false }),
			getPortDef({ name: 'href', displayName: 'Link', group: 'Params', type: 'string', multiline: true }),
			getPortDef({ name: 'sizeProp', displayName: 'Size', group: 'Dimensions', type: sizes, default: 'sm' }),
			getPortDef({ name: 'compact', displayName: 'Compact', group: 'Dimensions', type: 'boolean', default: false }),
			getPortDef({ name: 'fullWidth', displayName: 'Full width', group: 'Dimensions', type: 'boolean', default: false }),
			getPortDef({
				name: 'variant',
				displayName: 'Variant',
				group: 'Styles',
				type: [
					{ value: 'default', label: 'Default' },
					{ value: 'filled', label: 'Filled' },
					{ value: 'subtle', label: 'Subtle' },
					{ value: 'outline', label: 'Outline' },
					{ value: 'light', label: 'Light' },
					{ value: 'transparent', label: 'Transparent' },
					{ value: 'white', label: 'White' },
					{ value: 'gradient', label: 'Gradient' },
				],
				default: 'filled',
			}),
			getPortDef({
				name: 'gradient',
				displayName: 'Gradient',
				group: 'Styles',
				type: 'objectEval',
				dependsOn: (p: Props) => p.variant === 'gradient',
				codeComment: `//(props) => ({ from: 'blue', to: 'cyan', deg: 90 })`,
			}),
			getPortDef({ name: 'radius', displayName: 'Radius', group: 'Styles', type: sizes, default: 'md' }),
			getPortDef({ name: 'color', displayName: 'Color', group: 'Styles', type: 'string', default: 'blue' }),
			getPortDef({
				name: 'loaderProps',
				displayName: 'Loader props',
				group: 'Styles',
				type: 'objectEval',
				codeComment: `//(props) => ({ type: 'dots' })`,
			}),
			getPortDef({ name: 'disabled', displayName: 'Disabled', group: 'States', type: 'boolean', default: false }),
			getPortDef({ name: 'loading', displayName: 'Loading', group: 'States', type: 'boolean', default: false }),
			getPortDef({
				name: 'justify',
				displayName: 'Justify (CSS)',
				group: 'Advanced',
				type: 'string',
				dependsOn: (p: Props) => p.fullWidth,
			}),
		],
		outputs: [getPortDef({ name: 'clicked', displayName: 'Clicked', group: 'Signals', type: 'signal' })],
	},
} satisfies ReactNodeDef
