declare type SearchProps = {
    dbClasses: string[]
    query: { searchString?: string, fields: string[] }
    options?: Options
}

declare type FetchProps = {
    dbClass: string
    filters?: Filters
    sorts?: Sorts
    options?: Options
    subscribe?: boolean
}

declare type Filters = { [key: string]: any } | undefined
declare type Sorts = { [key: string]: 'asc' | 'desc' }[] | undefined
declare type Options = {
    size?: number
    refresh?: 'wait_for'
    lang?: 'koncorde'
} | undefined

declare type QueryKey = {
    dbVersion: string
    command: string
    dbClass: string | string[]
    query?: Query
    itemId?: string
    itemsIds?: string[]
    sort?: Sort
    options?: Options
}

declare type UseQueryOptionsProps = {
    command: 'fetch' | 'search'
    subscribe?: boolean | undefined
    searchString?: string | undefined
}

declare type UseKeys = {
    all: () => [{ dbVersion: string }]
    dbClass: (dbClass: string | string[]) => [{ dbVersion: string, dbClass: string | string[] }]
    command: (command: string, dbClass: string | string[]) => [{ dbVersion: string, dbClass: string | string[], command: string }]
    fetch: (props: FetchProps) =>
        [{ dbVersion: string, dbClass: string | string[], command: string, filters: Filters, sorts: Sorts, options: Options }]
    search: (props: SearchProps) =>
        [{ dbVersion: string, dbClass: string | string[], command: string, query: Filters, options: Options }]
}

declare type DbClassesDef = {
    [dbclass: string]: {
        version: number
        defaults: {
            filters: Filters
            sorts: Sorts
            options: Options
        }
    }
}

declare type KuzzleResponse = {
    hits: { _source: any; _id: string }[]
    fetched: number
    total: number
}

declare type NoodlDbClass = {
    dbClass: string
    items: Item[]
    fetchedCount: number
    totalCount: number
}

declare type KuzzleSubscribe = {
    dbClass: string
    filters?: Filters
    sorts?: Sorts
    options?: Options
}