import { ColorScheme } from '@mantine/core'
import { BaseReactProps } from '@shared/node'

export type CompProps = BaseReactProps & {
  appLoader?: boolean
  appLoaderColor?: string
  colorScheme: ColorScheme | 'auto'
}