import type { DividerProps } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
	dividerVariant: DividerProps['variant']
	dividerOrientation: DividerProps['orientation']
	dividerLabelPosition: DividerProps['labelPosition']
}
