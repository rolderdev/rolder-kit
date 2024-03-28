import { MantineSize, TitleOrder } from '@mantine/core'
import { BaseReactProps } from '@shared/node'

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