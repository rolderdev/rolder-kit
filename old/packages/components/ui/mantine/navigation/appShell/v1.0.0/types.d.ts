import type { AppShellProps, AsideProps, NavbarProps } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
	appShellLayout: AppShellProps['layout']
	hiddenAppShell: AppShellProps['hidden']
	appShellPadding: AppShellProps['padding']
	appShellCustomPadding?: string
}

export type AppShellState = {
	navbarHidden: boolean
	navbarBreakpoint: NavbarProps['hiddenBreakpoint']
	asideBreakpoint: AsideProps['hiddenBreakpoint']
	toggleNavbar: () => void
	setNavbarBreakpoint: (breakpoint: NavbarProps['hiddenBreakpoint']) => void
	setAsideBreakpoint: (breakpoint: AsideProps['hiddenBreakpoint']) => void
}
