declare type SearchProps = {
    dbClasses: string[]
    query: { searchString?: string, fields: string[] }
    options: any
}

type QueryKey = {
    dbVersion: string
    command: string
    dbClasses: string[]
    query?: any
    itemId?: string
    itemsIds?: string[]
    sort?: object
    options?: object
}