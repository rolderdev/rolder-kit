import type { BaseReactProps } from '@packages/node'
import type { Item } from 'types'

export type Props = BaseReactProps & {
	dataSource: 'item' | 'value'
	itemSource?: Item
	sourceField: string
	valueSource?: string | number
	textFormat: 'none' | 'number' | 'date' | 'mask'
	numberFormat: any
	dateFormat?: string
	textMask?: string
	link: string
	linkFromItem?: boolean
	linkField?: string
	truncate?: 'disabled' | 'end' | 'start'
}
