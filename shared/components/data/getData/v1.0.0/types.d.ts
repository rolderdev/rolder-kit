import { BaseJsProps } from '@shared/node'

export type Props = BaseJsProps & {
    fetchScheme: FetchScheme
}

export type FetchScheme = {
    dbClass: string    
}[]