declare type DbClassesDef = {
    [dbclass: string]: {
        version: number
        references?: string[]
        defaults: {
            filters: Filters
            sorts: Sorts
            options: Options
        }
    } | undefined
}
// data types
declare type KItem = {
    _id: string
    _source: any
    _version: number
}

declare interface RItem extends ItemBody {
    id: string
    dbClass: string
    refs: string[]
    customRefs: string[]
    _kuzzle_info?: {
        author: string
        createdAt: number
        updater: string | null
        updatedAt: number | null
    }
}

declare type ItemBody = {
    content?: { [key: string]: any }
    states?: { [key: string]: any }
    [key: string]: {
        id: string
        content?: { [key: string]: any }
    }
}

declare type KUser = {
    _id: string
    _source: any
    credentials?: {
        local?: {
            username?: string
            password?: string
            notSecret?: string
        }
    }
}

declare interface RUser {
    id: string
    content: {
        role: {
            value: string
            label: string
        }
    }
    credentials?: {
        local?: {
            username?: string
            password?: string
        }
    }
}
// fetcher
declare type KResponse = {
    hits?: KItem[] | KUser[]
    fetched: number
    total?: number
}

interface Queries { [nodeId: string]: KeysDef }

declare type KeysDef = {
    dbClass: string,
    filters?: Filters,
    sorts?: Sorts,
    options?: Options
    references?: string[]
    customReferences?: string[]
}

declare type Filters = { [key: string]: any }
declare type Sorts = { [key: string]: 'asc' | 'desc' }[]
declare type Options = {
    size?: number
    refresh?: 'wait_for'
    lang?: 'koncorde'
    silent?: boolean
}

////
declare type FetchQuery = {
    dbClass: string
    filters?: Filters
    sorts?: Sorts
    options?: Options
    subscribe?: boolean
}

declare type GetQuery = {
    dbClass: string
    itemId: string
    subscribe?: boolean
}


declare type GetQueryKey = {
    all: () => [{ dbVersion: string }]
    dbClass: (dbClass: string | string[]) => [{ dbVersion: string, dbClass: string | string[] }]
    command: (command: string, dbClass: string | string[]) => [{ dbVersion: string, dbClass: string | string[], command: string }]
    fetch: (props: FetchQuery) =>
        [{ dbVersion: string, dbClass: string | string[], command: string, filters: Filters, sorts: Sorts, options: Options }]
    get: (props: GetQuery) =>
        [{ dbVersion: string, dbClass: string | string[], command: string, itemId: string }]
}

declare type NDBClass = {
    dbClass: string
    items: RItem[]
    fetchedCount: number
    totalCount?: number
    subscribe?: boolean
}

declare interface QClass extends NDBClass {
    version: number
}

declare type SearchProps = {
    dbClass: string
    searchFields: string[]
    searchString?: string
    sorts?: Sorts
    useReferences?: boolean
    references?: string[]
    customReferences?: string[]
}

declare type SearchResults = {
    fetchedCount: number
    items: RItem[]
}

declare type LocalCreds = {
    username: string
    password: string
}

declare type UserSession = {
    username: string
    jwt: string
    jwtExpiresAt: string
}