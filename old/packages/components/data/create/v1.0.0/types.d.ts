import type { BaseJsProps } from '@packages/node'
import type { Item } from 'types'

export type Props = BaseJsProps & {
	scheme: CreateScheme
}

export type CreateScheme = {
	dbClass: string
	items?: Item[]
	itemsFunc?: string
}[]
