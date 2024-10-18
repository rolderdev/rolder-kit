import { forwardRef } from 'react'
import type { Props } from './types'
import { Avatar } from '@mantine/core'

export default forwardRef((props: Props) => (
	<Avatar variant={props.avatarVariant} {...props} {...props.customProps}>
		{props.children}
	</Avatar>
))
