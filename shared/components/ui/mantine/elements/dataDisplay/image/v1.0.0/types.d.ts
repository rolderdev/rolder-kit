import { MantineNumberSize } from "@mantine/core";
import { BaseReactProps } from '@shared/node'
import { Scope } from "@shared/scope";

export type Props = BaseReactProps & {
  useScope: boolean
  scope?: Scope
  placeholderIconSize?: string | number
}