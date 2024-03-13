import { BaseJsProps } from '@shared/node'
import { Item } from '@shared/types'

export type Props = BaseJsProps & {
    deleteScheme: DeleteScheme[]
}

export type DeleteScheme = {
    dbClass: string
    ids: string[]
}