declare type DataCache12 = {
    [dbClass: string]: RItem[]
}

declare type SearchResults12 = {
    [dbClass: string]: RItem[]
}

declare type DataScheme12 = {
    dbClass: string
    order?: number
    query?: Query
    sort?: Sort
    options?: Options
    filterBy?: {
        dbClassAccessor: string
        filterByDbClass: string
        filterByAccessor: string
    }[]
    getUsers?: boolean
    refs?: string[]
    backRefs?: string[]
    search?: {
        fields?: string[]
        setOutput?: {
            [dbClass: string]: {
                to: string
                [dbClass: string]: { to: string }
            }
        } | boolean
    }
}

declare type CompProps12 = {
    noodlNode: NoodlNode
    useDataScheme: DataScheme12[]
    searchString: string
}

/* declare type DataStore12 = {
    scheme: DataScheme12
    enabled: boolean
    items?: RItem[]
}
 */
declare type QueryComp12 = {
    noodlNode: NoodlNode,
    initialSchemes: DataScheme12[]
    initialScheme: DataScheme12
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