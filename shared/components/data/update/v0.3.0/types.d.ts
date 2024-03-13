import { BaseJsProps } from '@shared/node'
import { Item } from '@shared/types'

export type Props = BaseJsProps & {
    updateScheme: UpdateScheme[]
}

export type UpdateScheme = {
    dbClass: string
    order: number
    items: Item[]
}

export type UpdateUser = {
    id: string
    content: { [key: string]: any }
    credentials?: {
        local: {
            username: string
            password: string
            notSecret?: string
        }
    }    
}