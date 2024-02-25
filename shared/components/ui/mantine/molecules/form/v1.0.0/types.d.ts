import { MantineNumberSize } from "@mantine/core";
import { BaseReactProps } from '@shared/node'
import { FormValues, Scope } from "@shared/scope";

export type Props = BaseReactProps & {
  useScope: boolean
  scope?: Scope
  formScheme: FormValues
}