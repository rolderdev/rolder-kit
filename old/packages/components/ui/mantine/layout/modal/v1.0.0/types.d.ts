import { MantineSize, type TitleOrder } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
	sizePresets: MantineSizes
	sizeUnits?: string
	modalOpacity?: number
	modalBlur?: number
	modalHeaderEnabled?: boolean
	modalTitle?: string
	modalTitleOrder?: TitleOrder
	closeActionEnabled?: boolean
}
