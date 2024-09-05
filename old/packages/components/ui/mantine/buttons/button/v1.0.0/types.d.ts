import { ActionIconProps, ButtonProps, MantineColor } from '@mantine/core'
import { BaseReactProps } from '@packages/node'
import { Scope } from '@packages/scope'
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
}