import type { BaseJsProps } from '@packages/node'
import type { Item } from 'types'

export type Props = BaseJsProps & {
	deleteScheme: DeleteScheme[]
}

export type DeleteScheme = {
	dbClass: string
	ids: string[]
}
