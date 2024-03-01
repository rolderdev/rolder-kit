import { BaseReactProps } from '@shared/node'
import { Scope } from "@shared/scope";

export type Props = BaseReactProps & {
  useScope: boolean
  scope?: Scope
  value: string
  size?: number
}