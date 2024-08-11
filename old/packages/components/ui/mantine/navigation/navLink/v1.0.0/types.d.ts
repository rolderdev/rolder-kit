import { MantineColor, NavLinkProps } from '@mantine/core'
import { BaseReactProps } from '@packages/node'
import { Scope } from '@packages/scope'
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