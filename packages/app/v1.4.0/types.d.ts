import { ColorScheme } from '@mantine/core'
import { BaseReactProps } from '@rk/node'
import { RolderType } from '@rk/types'

export type CompProps = BaseReactProps & {
  appLoader?: boolean
  appLoaderColor?: string
  colorScheme: ColorScheme | 'auto'
}

declare global {
  interface Window {
    R: RolderType
    Noodl: any
  }
}