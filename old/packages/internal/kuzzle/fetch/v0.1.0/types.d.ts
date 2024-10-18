import { BaseJsProps } from '@packages/node'

export type Props = {
	dbClass: string
	filters?: { [key: string]: any }
	sorts?: { [key: string]: 'asc' | 'desc' }[]
	querySize?: number
	searchAfter?: string[]
	getUsers?: boolean
	aggQuery?: Filters
}
