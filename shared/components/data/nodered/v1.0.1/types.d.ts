import { BaseJsProps } from '@shared/node'

export type Props = BaseJsProps & {
    flowEndpoint: string
    flowData?: {
        data: any
        files: File[],
        params: any
    }
}