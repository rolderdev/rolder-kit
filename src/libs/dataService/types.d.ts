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

declare type KItem = {
    _id: string
    _source: any
    _version: number
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

declare interface NItem extends ItemBody {
    id: string
    _kuzzle_info?: {
        author: string
        createdAt: number
        updater: string | null
        updatedAt: number | null
    }
}

declare type CreateUpdateUser = {
    id?: string
    body: {
        content: { [key: string]: any }
        credentials?: {
            local: {
                username: string
                password: string
                notSecret?: string
            }
        }
    }
}

declare interface RItem extends ItemBody {
    id: string
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
    refs?: {
        id: string
        content?: { [key: string]: any }
    }
    [key: string]: {
        id: string
        content?: { [key: string]: any }
    }
}

declare type CreateUpdateItem = {
    dbClass: string
    id?: string
    body: ItemBody
}

declare type CreateUpdateItems = {
    dbClass: string
    items: {
        id?: string
        body: ItemBody
    }[]
}

type CreateUpdateScheme = {
    dbClass: string
    order: number
    id?: string
    references: string[]
    body: Item
}

type MCreateUpdateScheme = {
    dbClass: string
    order: number
    references: string[]
    items: {
        id?: string
        body: ItemBody
    }[]
}

declare type KResponse = {
    hits?: KItem[] | KUser[]
    fetched: number
    total?: number
}

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

declare type Filters = { [key: string]: any } | undefined
declare type Sorts = { [key: string]: 'asc' | 'desc' }[] | undefined
declare type Options = {
    size?: number
    refresh?: 'wait_for'
    lang?: 'koncorde'
    silent?: boolean
} | undefined

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
    searchString?: string
    searchDelay?: number
    searchFields?: string[]
    useReferences?: boolean
    sorts?: Sorts
}

declare type SearchResults = {
    fetchedCount: number
    totalCount: number
    [key: string]: RItem[]
}

declare type SearchNResults = {
    fetchedCount: number
    totalCount: number
    items: NItem[]
}

declare type SearchKResponse = {
    total: number
    hits: {
        _id: string
        collection: string
        _source: KItem
    }[]
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