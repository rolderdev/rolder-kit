import { BaseReactProps } from '@shared/node'
import { Scope } from "@shared/scope";
import { Item } from '@shared/types'

export type Props = BaseReactProps & {
  useScope: boolean
  scope?: Scope 
}