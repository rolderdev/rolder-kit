declare type CompProps123 = {
    noodlNode: NoodlNode
    dbClass2: string
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

declare type DataScheme123 = {
    dbClass: string
    filters?: Filters
    sorts?: Sorts
    size?: number
    refs?: string[]
    backRefs?: string[]
    searchAfter?: string[]
    getUsers?: boolean
    aggQuery?: Filters
}

declare type Filters = { [key: string]: any }
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