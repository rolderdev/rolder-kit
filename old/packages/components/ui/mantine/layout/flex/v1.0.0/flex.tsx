import { Flex } from '@mantine/core'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => (
	<Flex
		justify={props.flexJustify}
		align={props.flexAlign}
		direction={props.flexDirection}
		wrap={props.flexWrap}
		{...props}
		{...props.customProps}
	>
		{props.children}
	</Flex>
))
