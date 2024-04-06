import { } from '@packages/types'

export type DataScheme = {
    dbClass: string
    filters?: Filters
    sorts?: Sorts
    querySize?: number
    refs?: string[]
    backRefs?: string[]
    searchAfter?: string[]
    getUsers?: boolean
    aggQuery?: Filters
}

type Filters = { [key: string]: any }
export type Sorts = { [key: string]: 'asc' | 'desc' }[]