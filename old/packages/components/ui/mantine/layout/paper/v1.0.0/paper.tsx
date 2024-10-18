import { forwardRef } from 'react'
import type { Props } from './types'
import { Paper } from '@mantine/core'

export default forwardRef((props: Props) => (
	<Paper {...props} {...props.customProps}>
		{props.children}
	</Paper>
))
