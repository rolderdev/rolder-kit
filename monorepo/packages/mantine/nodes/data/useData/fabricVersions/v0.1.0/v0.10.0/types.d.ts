declare type CompProps = {
    noodlNode: NoodlNode
    dbClass: string
    filters?: Filters
    sorts?: Sorts
    options?: Options
    refs?: string[]
    backRefs?: string[]
    getUsers?: boolean
    searchString?: string
    searchScheme?: SearchScheme
    useRefs?: boolean
}

declare type QueryKey = {
    dbClass: string
    filters?: Filters
    sorts?: Sorts
    options?: Options
    refs?: string[]
    backRefs?: string[]
    getUsers?: boolean
}
declare type Search = {
    searchString: string
    searchScheme: SearchScheme
}
declare type SearchScheme = {
    [dbClass: string]: {
        fields: string[]
        filters?: Filters
        sorts?: Sorts
        refs?: string[]
        backRefs?: string[]
        getUsers?: boolean
    }
}

declare type ItemSysProps = {
    dbClass: string
    noodlNodeId: string
    refs?: string[]
    backRefs?: string[]
}

declare type Filters = { [key: string]: any }
declare type Sorts = { [key: string]: 'asc' | 'desc' }[]
declare type Options = {
    size?: number
    refresh?: 'wait_for'
    lang?: 'koncorde'
    silent?: boolean
}

declare interface RItem extends ItemSysProps extends ItemBody {
    id: string
    user?: any
    _kuzzle_info?: {
        author: string
        createdAt: number
        updater: string | null
        updatedAt: number | null
    }
}