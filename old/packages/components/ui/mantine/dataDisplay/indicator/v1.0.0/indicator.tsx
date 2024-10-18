import { Indicator } from '@mantine/core'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => (
	<Indicator
		size={props.sizeUnits}
		position={props.indicatorPosition}
		processing={props.indicatorProcessing}
		{...props}
		{...props.customProps}
	>
		{props.children}
	</Indicator>
))
