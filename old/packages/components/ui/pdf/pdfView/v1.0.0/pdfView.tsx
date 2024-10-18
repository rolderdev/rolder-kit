import { getCompProps } from '@packages/get-comp-props'
import { View } from '@react-pdf/renderer'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => {
	const p = { ...getCompProps(props) } as Props

	return (
		<View wrap={p.wrap} fixed={p.fixed} style={p.style} {...p.customProps}>
			{p.children}
		</View>
	)
})
