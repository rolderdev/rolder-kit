import type { MantineSize, NavbarProps } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
	navbarWithBorder?: boolean
	navbarWidth: NavbarProps['width']
	navbarHiddenBreakpoint?: MantineSize
}
