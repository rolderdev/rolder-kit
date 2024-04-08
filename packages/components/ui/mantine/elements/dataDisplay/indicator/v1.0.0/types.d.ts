import { IndicatorProps, LoaderProps, MantineTheme } from '@mantine/core'
import { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
  sizeUnits?: string
  indicatorPosition?: IndicatorProps['position']
  indicatorProcessing?: boolean
}