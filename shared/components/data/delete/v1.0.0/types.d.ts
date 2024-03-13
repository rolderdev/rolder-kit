import { BaseJsProps } from '@shared/node'
import { Item } from '@shared/types'

export type Props = BaseJsProps & {
    scheme: DeleteScheme
}

export type DeleteScheme = {
    dbClass: string
    ids?: string[]
    idsFunc?: string
}[]