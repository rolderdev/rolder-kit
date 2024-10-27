import { Navbar } from '@mantine/core'
import { getCompProps } from '@packages/get-comp-props'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => {
	const p = { ...getCompProps(props) } as Props

	return (
		<Navbar.Section {...p} {...p.customProps}>
			{props.children}
		</Navbar.Section>
	)
})
