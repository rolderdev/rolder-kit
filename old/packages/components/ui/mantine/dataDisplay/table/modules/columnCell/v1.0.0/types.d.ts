import { BaseReactProps } from '@packages/node'
import { Scope } from "@packages/scope";
import type { Item } from 'types'

export type Props = BaseReactProps & {
  useScope: boolean
  scope?: Scope
  table2Controlled?: boolean  
}