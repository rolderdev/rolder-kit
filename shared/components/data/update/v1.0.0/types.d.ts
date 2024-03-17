import { BaseJsProps } from '@shared/node'
import { Item } from '@shared/types'

export type Props = BaseJsProps & {
    scheme: UpdateScheme
    optimistic?: boolean
}

export type UpdateScheme = {
    dbClass: string    
    items?: Item[]
    itemsFunc?: string
    silent?: boolean
    offlineSilent?: boolean
}[]