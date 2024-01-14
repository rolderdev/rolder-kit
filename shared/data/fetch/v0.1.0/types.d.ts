import { BaseJsProps } from '@shared/node'

export type Props = BaseJsProps & {
    dbClass?: string
    filters?: { [key: string]: any }
    sorts?: { [key: string]: 'asc' | 'desc' }[]
    querySize?: number
}