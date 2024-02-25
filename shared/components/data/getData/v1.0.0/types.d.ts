import { BaseJsProps } from '@shared/node'

export type Props = BaseJsProps & {
    fetchScheme: FetchScheme
}

export type FetchScheme = {
    dbClass: string
    order?: number
    filters?: Filters
    sorts?: Sorts
    size?: number
    refs?: string[]
    backRefs?: string[]
    getUsers?: boolean
    //searchAfter?: string[]    
    //aggQuery?: Filters
}[]

type Filters = { [key: string]: any }
export type Sorts = { [key: string]: 'asc' | 'desc' }[]

/* export type PagesSearchAfter = {
    page: number
    searchAfter?: any[]
}

export type UseQueryData ={
    items: RItem[]
    total: number
    aggregations?: any
} */