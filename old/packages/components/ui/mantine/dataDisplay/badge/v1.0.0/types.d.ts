import { BadgeVariant, MantineNumberSize } from "@mantine/core";
import { BaseReactProps } from '@packages/node'
import { Scope } from "@packages/scope";

export type Props = BaseReactProps & {
  useScope: boolean
  scope?: Scope
  label?: string
  badgeVariant: BadgeVariant
}