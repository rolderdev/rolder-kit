import type { MantineColor, MantineGradient, MantineNumberSize, ThemeIconVariant } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'
import type { Scope } from '@packages/scope'

export type Props = BaseReactProps & {
	useScope: boolean
	scope?: Scope
	iconType: 'icon' | 'themeIcon'
	iconName?: string
	iconSize?: MantineNumberSize
	iconColor?: MantineColor
	iconStroke?: number
	themeIconVariant?: ThemeIconVariant
	themeIconSize?: MantineNumberSize
	themeIconRadius?: MantineNumberSize
	themeIconColor?: MantineColor
	themeIconGradient?: MantineGradient
}
