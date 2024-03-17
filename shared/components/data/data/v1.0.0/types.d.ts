import { BaseReactProps, NoodlNode } from '@shared/node'
import { Item } from '@shared/types'

export type Props = BaseReactProps & {
    backendVersion: string
    dbName: string
    persistData?: boolean
    backendDevMode?: boolean
    backendUrl: string
    backendPort: number
}

export type MutationFnProps = {
    action: 'create' | 'update' | 'delete'
    scheme: {
        dbClass: string
        items: Item[]
    }[]
}