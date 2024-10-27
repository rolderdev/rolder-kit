import { AppShell } from '@mantine/core'
import { getCompProps } from '@packages/get-comp-props'
import useNamedChildren from '@packages/use-named-children'
import { forwardRef } from 'react'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { AppShellState, Props } from './types'

export const useAppShellStore = create<AppShellState>()(
	immer((set) => ({
		navbarHidden: true,
		navbarBreakpoint: 'sm',
		asideBreakpoint: 'sm',
		toggleNavbar: () =>
			set((state) => {
				state.navbarHidden = !state.navbarHidden
			}),
		setNavbarBreakpoint: (navbarBreakpoint) =>
			set((state) => {
				state.navbarBreakpoint = navbarBreakpoint
			}),
		setAsideBreakpoint: (asideBreakpoint) =>
			set((state) => {
				state.asideBreakpoint = asideBreakpoint
			}),
	}))
)

export default forwardRef((props: Props, ref) => {
	const p = { ...getCompProps(props) } as Props

	const { matchedChildren, restChildren } = useNamedChildren(props.children, ['Navbar', 'Header', 'Aside', 'Footer'])
	const navbarBreakpoint = useAppShellStore((state) => state.navbarBreakpoint)

	return (
		<AppShell
			layout={p.appShellLayout}
			hidden={p.hiddenAppShell}
			padding={p.appShellCustomPadding ? p.appShellCustomPadding : p.appShellPadding}
			navbarOffsetBreakpoint={navbarBreakpoint}
			asideOffsetBreakpoint={'sm'}
			header={matchedChildren.Header}
			footer={matchedChildren.Footer}
			navbar={matchedChildren.Navbar}
			aside={matchedChildren.Aside}
			{...p}
			{...p.customProps}
		>
			{restChildren}
		</AppShell>
	)
})
