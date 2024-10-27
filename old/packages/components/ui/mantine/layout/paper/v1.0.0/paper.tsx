import { Paper } from '@mantine/core'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => (
	<Paper {...props} {...props.customProps}>
		{props.children}
	</Paper>
))
