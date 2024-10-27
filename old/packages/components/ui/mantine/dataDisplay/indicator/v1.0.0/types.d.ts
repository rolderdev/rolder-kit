import { type IndicatorProps, LoaderProps, MantineTheme } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
	sizeUnits?: string
	indicatorPosition?: IndicatorProps['position']
	indicatorProcessing?: boolean
}
