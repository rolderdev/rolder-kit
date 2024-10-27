import type { ColorScheme } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'

export type CompProps = BaseReactProps & {
	appLoader?: boolean
	appLoaderColor?: string
	colorScheme: ColorScheme | 'auto'
}
