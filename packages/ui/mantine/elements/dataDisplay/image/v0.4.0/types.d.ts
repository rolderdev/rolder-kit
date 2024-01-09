import { MantineNumberSize } from "@mantine/core";
import { BaseReactProps } from '@rk/node'
import { Scopes } from "@rk/scope";

export type CompProps = BaseReactProps & {
  useScope: boolean
  scope?: Scopes
  placeholderIconSize?: string | number
}