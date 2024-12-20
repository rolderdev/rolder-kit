import { Navbar } from '@mantine/core'
import { useAppShellStore } from '@packages/app-shell'
import { getCompProps } from '@packages/get-comp-props'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props, ref) => {
	const p = { ...getCompProps(props) } as Props

	const navbarHidden = useAppShellStore((state) => state.navbarHidden)
	const setNavbarBreakpoint = useAppShellStore((state) => state.setNavbarBreakpoint)
	const toggleNavbar = useAppShellStore((state) => state.toggleNavbar)

	useEffect(() => setNavbarBreakpoint(p.navbarHiddenBreakpoint), [props.navbarHiddenBreakpoint])

	useImperativeHandle(
		ref,
		() => ({
			responsiveToggle() {
				toggleNavbar()
			},
		}),
		[]
	)

	return (
		<Navbar
			hidden={navbarHidden}
			hiddenBreakpoint={p.navbarHiddenBreakpoint}
			width={p.navbarWidth}
			withBorder={p.navbarWithBorder}
			{...p}
			{...p.customProps}
		>
			{props.children}
		</Navbar>
	)
})
