import { ActionIconProps, ButtonProps, MantineColor } from '@mantine/core'
import { BaseReactProps } from '@shared/node'
import { Scope } from '@shared/scope'
import { Item } from '@shared/types'

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
}