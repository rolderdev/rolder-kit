import { BaseReactProps } from '@shared/node'
import { Scope } from "@shared/scope";
import { Item } from '@shared/types'

export type Props = BaseReactProps & {
  table2ColumnIndex: number
  table2FilterValue: any
}