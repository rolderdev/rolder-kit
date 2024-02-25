import { MantineColor } from '@mantine/core'
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
    defaultItem?: any
}