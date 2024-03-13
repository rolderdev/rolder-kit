import { BaseReactProps, NoodlNode } from '@shared/node'

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
    scheme: any    
}