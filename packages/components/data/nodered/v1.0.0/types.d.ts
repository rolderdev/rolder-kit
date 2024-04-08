import { BaseJsProps } from '@packages/node'

export type Props = BaseJsProps & {
    flowEndpoint: string
    flowData: {
        data: any
        files: File[],
        params: any
    }
}