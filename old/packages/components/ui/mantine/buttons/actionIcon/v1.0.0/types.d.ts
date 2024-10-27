import { type ActionIconProps, MantineColor } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'
import type { Scope } from '@packages/scope'
import type { Item } from 'types'

export type Props = BaseReactProps & {
	useScope: boolean
	scope?: Scope
	actionIconVariant?: ActionIconProps['variant']
	iconName?: string
	iconSize?: string
	iconStroke?: number
	iconColor?: string
}
