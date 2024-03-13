declare type DataCache = {
    [dbClass: string]: RItem[]
}

declare type GetDataScheme2 = {
    dbClass: string
    order?: number
    query?: Query
    sort?: Sort
    options?: Options
    getUsers?: boolean
    sendStates?: boolean
    refs?: string[]
    backRefs?: string[]
    filterBy?: string[]
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
    _kuzzle_info?: {
        author: string
        createdAt: number
        updater: string | null
        updatedAt: number | null
    }
}