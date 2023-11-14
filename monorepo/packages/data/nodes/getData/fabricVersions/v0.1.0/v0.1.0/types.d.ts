declare type QueryProps = {
    dbClass: string
    filters?: Filters
    sorts?: Sorts
    options?: Options
}
declare type Filters = { [key: string]: any }
declare type Sorts = { [key: string]: 'asc' | 'desc' }[]
declare type Options = {
    size?: number
    refresh?: 'wait_for'
    lang?: 'koncorde'
    silent?: boolean
}