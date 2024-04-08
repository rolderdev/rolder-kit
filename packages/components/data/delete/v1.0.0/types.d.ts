import { BaseJsProps } from '@packages/node'

export type Props = BaseJsProps & {
    scheme: DeleteScheme
}

export type DeleteScheme = {
    dbClass: string
    ids?: string[]
    idsFunc?: string
}[]