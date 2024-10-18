import type { HeaderProps, MantineNumberSize } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
	headerWithBorder?: boolean
	headerHeight: HeaderProps['height']
	burgerSize?: MantineNumberSize
}
