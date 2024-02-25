import { NoodlNode, BaseReactProps } from '@shared/node'
import {RItem} from '@shared/types'

export type Props = BaseReactProps & {
    useDataScheme: DataScheme[]
    searchString: string
}

declare type DataCache = {
    [dbClass: string]: RItem[]
}

declare type SearchResults = {
    [dbClass: string]: RItem[]
}

declare type DataStates = {
    pendingCount: number
    fetchingCount: number
}

declare type DataScheme = {
    dbClass: string
    query?: Query
    sort?: Sort
    options?: Options
    getUsers?: boolean
    sendStates?: boolean
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

declare type DataProps = {
    noodlNode: NoodlNode
    useDataScheme: DataScheme[]
    dataScheme: DataScheme
    searchString: string
}

declare type Query = { [key: string]: any }
declare type Sort = { [key: string]: 'asc' | 'desc' }[]
declare type Options = {
    size?: number
    refresh?: 'wait_for'
    lang?: 'koncorde'
    silent?: boolean
}