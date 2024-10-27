import { Title, type TitleOrder } from '@mantine/core'
import { forwardRef } from 'react'
import type { Props } from '../node/definition'

export default forwardRef((p: Props) => (
	<Title order={Number.parseInt(p.orderProp) as TitleOrder} {...p} {...p.customProps}>
		{p.stringValue || p.numberValue}
	</Title>
))
