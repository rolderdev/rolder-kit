import { BaseReactProps } from '@shared/node'

export type Props = BaseReactProps & {
  loaderColor?: string
  loading?: boolean
  barLoaderWidth?: string
  zIndex?: number
}