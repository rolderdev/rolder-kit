import { MantineNumberSize } from "@mantine/core";
import { BaseReactProps } from '@shared/node'
import { Scopes } from "@shared/scope";

export type CompProps = BaseReactProps & {
  useScope: boolean
  scope?: Scopes
  placeholderIconSize?: string | number
}