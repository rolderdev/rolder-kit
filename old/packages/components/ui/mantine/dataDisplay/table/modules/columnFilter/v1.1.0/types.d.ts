import type { BaseReactProps } from '@shared/node'
import { Scope } from '@shared/scope'
import type { Item } from '@shared/types'

export type Props = BaseReactProps & {
	table2ColumnIndex: number
	table2FilterValue: any
}
