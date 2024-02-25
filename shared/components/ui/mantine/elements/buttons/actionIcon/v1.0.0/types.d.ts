import { ActionIconProps, MantineColor } from '@mantine/core'
import { BaseReactProps } from '@shared/node'
import { Scope } from '@shared/scope'
import { Item } from '@shared/types'

export type Props = BaseReactProps & {
    useScope: boolean
    scope?: Scope
    actionIconVariant?: ActionIconProps['variant']
    iconName?: string
    iconSize?: string
    iconStroke?: number
    iconColor?: string
}