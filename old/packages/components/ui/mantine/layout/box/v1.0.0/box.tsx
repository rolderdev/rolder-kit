import { forwardRef } from 'react'
import type { Props } from './types'
import { Box } from '@mantine/core'

export default forwardRef((props: Props) => (
	<Box {...props} {...props.customProps}>
		{props.children}
	</Box>
))
