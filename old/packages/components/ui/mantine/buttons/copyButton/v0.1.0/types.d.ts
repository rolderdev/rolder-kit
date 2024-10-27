import { ActionIconProps, type ButtonProps, MantineColor } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'
import type { Scope } from '@packages/scope'
import type { Item } from 'types'

export type Props = BaseReactProps & {
	useScope: boolean
	scope?: Scope
	buttonVariant?: ButtonProps['variant']
	buttonType?: ButtonProps['type']
	label?: string
	iconName?: string
	iconSize?: string
	iconStroke?: number
	iconColor?: string
	copyValue: string
	copiedColor: string
	color: string
	copiedLabel?: string
}
