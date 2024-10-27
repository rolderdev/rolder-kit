import type { AsideProps, MantineSize } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
	asideWithBorder?: boolean
	asideWidth: AsideProps['width']
	asideHiddenBreakpoint?: MantineSize
}
