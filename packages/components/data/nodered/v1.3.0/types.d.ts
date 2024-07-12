import { BaseJsProps } from '@packages/node'

export type Props = BaseJsProps & {
    flowEndpoint: string
    flowData?: {
        data: any
        files: File[],
        params: any
    },
    timeout: number         // Vezdexod
    useServices: boolean    // Vezdexod
    selectedService: string // Vezdexod
    serviceVersion: string  // Vezdexod
}