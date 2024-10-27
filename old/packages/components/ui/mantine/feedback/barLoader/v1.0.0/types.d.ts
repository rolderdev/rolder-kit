import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
	loaderColor?: string
	loading?: boolean
	barLoaderWidth?: string
	zIndex?: number
}
