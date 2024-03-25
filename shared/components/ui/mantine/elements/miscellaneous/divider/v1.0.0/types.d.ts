import { DividerProps } from '@mantine/core'
import { BaseReactProps } from '@shared/node'

export type Props = BaseReactProps & {
  dividerVariant: DividerProps['variant']
  dividerOrientation: DividerProps['orientation']
  dividerLabelPosition: DividerProps['labelPosition']
}