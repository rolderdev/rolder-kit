import { Stack } from '@mantine/core'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => (
	<Stack {...props} {...props.customProps}>
		{props.children}
	</Stack>
))
