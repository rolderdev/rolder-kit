import { IndicatorProps, LoaderProps, MantineTheme } from '@mantine/core'
import { BaseReactProps } from '@shared/node'

export type Props = BaseReactProps & {
  sizeUnits?: string
  indicatorPosition?: IndicatorProps['position']
  indicatorProcessing?: boolean
}