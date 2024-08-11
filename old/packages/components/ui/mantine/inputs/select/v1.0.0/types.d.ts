import { MantineColor } from '@mantine/core'
import { BaseReactProps } from '@packages/node'
import { Scope } from '@packages/scope'
import type { Item } from 'types'

export type Props = BaseReactProps & {
    useScope: boolean
    scope?: Scope
    formField: string
    inputError?: boolean | string
    iconName?: string
    iconSize?: string
    iconStroke?: number
    iconColor?: string    
    inputItems?: Item[]
    labelField?: string
    backgroundColor?: MantineColor
    defaultItem?: any
}