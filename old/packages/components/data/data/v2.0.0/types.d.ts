import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {}

export type MutationFnProps = {
	action: 'create' | 'update' | 'delete'
	scheme: {
		dbClass: string
		items: Item[]
	}[]
	silent?: boolean
}
