import { MantineColor, MantineNumberSize } from '@mantine/core'
import { BaseReactProps } from '@packages/node'
import { Scope } from '@packages/scope'
import type { Item } from 'types'

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