import { MantineColor } from '@mantine/core'
import { BaseReactProps } from '@shared/node'
import { Scope } from '@shared/scope'
import { Item } from '@shared/types'

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
    defaultItems?: any
}