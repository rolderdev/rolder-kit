import { MantineColor, NavLinkProps } from '@mantine/core'
import { BaseReactProps } from '@shared/node'
import { Scope } from '@shared/scope'
import { Item } from '@shared/types'

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