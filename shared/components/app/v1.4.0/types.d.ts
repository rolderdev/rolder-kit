import { ColorScheme } from '@mantine/core'
import { BaseReactProps } from '@shared/node'
import { } from '@shared/types'

export type CompProps = BaseReactProps & {
  appLoader?: boolean
  appLoaderColor?: string
  colorScheme: ColorScheme | 'auto'
}