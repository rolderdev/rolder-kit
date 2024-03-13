declare interface RItem {
    id: string    
    content?: { [key: string]: any }
    states?: { [key: string]: any }
    [key: string]: {
        id: string
        content?: { [key: string]: any }
    }
    _kuzzle_info?: {
        author: string
        createdAt: number
        updater: string | null
        updatedAt: number | null
    }
}

declare type Filters = { [key: string]: any }
declare type Sorts = { [key: string]: 'asc' | 'desc' }[]