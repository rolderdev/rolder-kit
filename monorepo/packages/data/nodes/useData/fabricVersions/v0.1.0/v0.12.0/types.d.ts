declare type CompProps12 = {
    noodlNode: NoodlNode
    dbClass2: string
    filters?: Query
    sorts?: Sorts
    querySize?: number
    refs?: string[]
    backRefs?: string[]
    getUsers?: boolean
    searchFields?: string[]
    searchString?: string
    aggQuery?: Query
}

declare type DataScheme12 = {
    dbClass: string
    filters?: Query
    sorts?: Sorts
    size?: number
    refs?: string[]
    backRefs?: string[]
    searchAfter?: string[]
    getUsers?: boolean
    aggQuery?: Query
}

declare type Query = { [key: string]: any }
declare type Sorts = { [key: string]: 'asc' | 'desc' }[]

declare type PagesSearchAfter = {
    page: number
    searchAfter?: any[]
}

declare interface RItem extends ItemBody {
    id: string
    user?: any
    _kuzzle_info?: {
        author: string
        createdAt: number
        updater: string | null
        updatedAt: number | null
    }
}