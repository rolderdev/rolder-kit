import { BadgeVariant, MantineNumberSize, type TitleOrder } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'
import type { Scope } from '@packages/scope'

export type Props = BaseReactProps & {
	useScope: boolean
	scope?: Scope
	dataSource: 'item' | 'value'
	itemSource: RItem
	sourceField: string
	valueSource: string
	textFormat: 'none' | 'number' | 'date' | 'mask'
	numberFormat: any
	dateFormatAtText: string
	textMask: string
	fitContent: boolean
	titleOrder: TitleOrder
}
