import { BaseJsProps } from '@shared/node'
import { Item } from '@shared/types'

export type Props = BaseJsProps & {
    createScheme: CreateScheme[]
}

export type CreateScheme = {
    dbClass: string
    order: number
    items: Item[]
}

export type CreateUser = {
    content: { [key: string]: any }
    credentials?: {
        local: {
            username: string
            password: string
            notSecret?: string
        }
    }
}