import { BaseReactProps, NoodlNode } from '@shared/node'

export type Props = BaseReactProps & {
    backendVersion: string
    dbName: string
    backendDevMode?: boolean
    backendUrl: string
    backendPort: number
}