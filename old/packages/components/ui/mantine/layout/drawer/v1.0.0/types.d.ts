import { type DrawerProps, MantineSize, type TitleOrder } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
	drawerPosition: DrawerProps['position']
	sizePresets: MantineSizes
	sizeUnits?: string
	drawerOpacity?: number
	drawerBlur?: number
	drawerHeaderEnabled?: boolean
	drawerTitle?: string
	drawerTitleOrder?: TitleOrder
	closeActionEnabled?: boolean
}
