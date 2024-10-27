import type { ColorScheme } from '@mantine/core'
import type { BaseReactProps } from '@shared/node'
import { RolderType } from '@shared/types'

export type CompProps = BaseReactProps & {
	appLoaderColor?: string
	colorScheme: ColorScheme | 'auto'
}
