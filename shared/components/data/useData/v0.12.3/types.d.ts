import { BaseReactProps } from '@shared/node'

export type Props = BaseReactProps & {
    dbClass: string
    filters?: Filters
    sorts?: Sorts
    querySize?: number
    refs?: string[]
    backRefs?: string[]
    getUsers?: boolean
    searchFields?: string[]
    searchString?: string
    aggQuery?: Filters
}

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

export type PagesSearchAfter = {
    page: number
    searchAfter?: any[]
}

export type UseQueryData ={
    items: RItem[]
    total: number
    aggregations?: any
}