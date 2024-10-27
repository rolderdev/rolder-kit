import { Stack } from '@mantine/core'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => (
	<Stack align={props.stackAlign} justify={props.stackJustify} spacing={props.stackSpacing} {...props} {...props.customProps}>
		{props.children}
	</Stack>
))
