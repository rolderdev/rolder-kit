import { BaseJsProps } from '@packages/node'
import type { Item } from 'types'

export type Props = BaseJsProps & {
    scheme: UpdateScheme
    optimistic?: boolean,
    silent?: boolean
}

export type UpdateScheme = {
    dbClass: string
    items?: Item[]
    itemsFunc?: string
    history?: boolean
    silent?: boolean
    offlineSilent?: boolean
    query?: {                 // Vezdexod
        filter: object,
        newValue: object
    }
}[]
