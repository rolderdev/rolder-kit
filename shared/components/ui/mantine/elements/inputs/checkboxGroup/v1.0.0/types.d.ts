import { MantineColor, MantineNumberSize } from '@mantine/core'
import { BaseReactProps } from '@shared/node'
import { Scope } from '@shared/scope'
import { Item } from '@shared/types'

export type Props = BaseReactProps & {
    useScope: boolean
    scope?: Scope
    formField: string
    inputError?: boolean | string
    inputItems?: Item[]
    labelField?: string
    defaultItems?: any[]
    orientation?: 'horizontal' | 'vertical'
    grow?: boolean
    withAsterisk?: boolean
    checkBoxFz?: MantineNumberSize
    disabled?: boolean
    checkboxColor?: MantineColor
}