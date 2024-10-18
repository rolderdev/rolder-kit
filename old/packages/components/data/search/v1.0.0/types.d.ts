import type { BaseJsProps } from '@packages/node'
import type { IFuseOptions } from 'fuse.js'
import type { Item } from 'types'

export type Props = BaseJsProps & {
	fields?: string[]
	minMatchCharLength?: number
	searchString?: string
	customOptions?: IFuseOptions<Item>
	items?: Item[]
}
