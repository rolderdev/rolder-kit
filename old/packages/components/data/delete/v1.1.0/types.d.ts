import type { BaseJsProps } from '@packages/node'

export type Props = BaseJsProps & {
	scheme: DeleteScheme
	silent?: boolean
}

export type DeleteScheme = {
	dbClass: string
	ids?: string[]
	idsFunc?: string
}[]
