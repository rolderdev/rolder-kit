import type { BaseJsProps } from '@packages/node'

export type Props = BaseJsProps & {
	fetchScheme: FetchScheme
}

export type FetchScheme = {
	dbClass: string
}[]
