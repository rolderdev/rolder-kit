declare type FetchScheme5 = {
    dbName: string
    dbClass: string
    query?: Query
    sort?: Sort
    options?: Options
}

declare type Query = { [key: string]: any }
declare type Sort = { [key: string]: 'asc' | 'desc' }[]
declare type Options = {
    size?: number
    refresh?: 'wait_for'
    lang?: 'koncorde'
    silent?: boolean
}

declare interface RItem extends ItemBody {
    id: string
    user?: any
    refId?: number
    _kuzzle_info?: {
        author: string
        createdAt: number
        updater: string | null
        updatedAt: number | null
    }
}