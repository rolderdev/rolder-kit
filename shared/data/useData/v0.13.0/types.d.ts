import { BaseReactProps } from '@shared/node'

export type Props = BaseReactProps & {
    fetchScheme: FetchScheme
    searchEnabled: boolean
    searchScheme?: SearchScheme
    searchString?: string
}

export type FetchScheme = BaseScheme & {
    order?: number
}[]

export type SearchScheme = BaseScheme & {
    fields?: string
}[]

export type BaseScheme = {
    dbClass?: string
    filters?: Filters | string
    sorts?: Sorts
    size?: number
    refs?: string[]
    backRefs?: string[]
    getUsers?: boolean
    searchAfter?: string[]
    aggregations?: { [key: string]: any }
}[]

type Filters = { [key: string]: any }
export type Sorts = { [key: string]: 'asc' | 'desc' }[]

export type Data = { [dbClass: string | undefined]: FetchResult }

export type FetchResult = {
    items?: Item[];
    fetched?: number;
    total?: number;
    aggregations?: { [key: string]: any }
    error?: string
}

/* export type PagesSearchAfter = {
    page: number
    searchAfter?: any[]
}*/