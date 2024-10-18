import { Box } from '@mantine/core'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => (
	<Box {...props} {...props.customProps}>
		{props.children}
	</Box>
))
