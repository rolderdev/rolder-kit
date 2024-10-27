import { MantineColor, type NavLinkProps } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'
import type { Scope } from '@packages/scope'
import type { Item } from 'types'

export type Props = BaseReactProps & {
	useScope: boolean
	scope?: Scope
	navLinkVariant: NavLinkProps['variant']
	active: NavLinkProps['active']
	label?: string
	activateLabel?: string
	iconName?: string
	iconSize?: string
	iconStroke?: number
	iconColor?: string
}
