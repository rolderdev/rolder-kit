import { Center } from '@mantine/core'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => (
	<Center {...props} {...props.customProps}>
		{props.children}
	</Center>
))
