import { BaseReactProps } from '@packages/node'
import { Scope } from "@packages/scope";
import type { Item } from 'types'

export type Props = BaseReactProps & {
  table2ColumnIndex: number
  table2FilterValue: any
}