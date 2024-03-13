import { BaseJsProps } from '@shared/node'
import { Item } from '@shared/types'

export type Props = BaseJsProps & {
    scheme: CreateScheme
}

export type CreateScheme = {
    dbClass: string
    items?: Item[]
    itemsFunc?: string
}[]