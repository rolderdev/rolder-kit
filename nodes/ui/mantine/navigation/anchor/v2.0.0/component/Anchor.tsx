import { Anchor } from '@mantine/core'
import { forwardRef } from 'react'
import type { Props } from '../node/definition'

export default forwardRef((p: Props) => (
	<Anchor target="_blank" truncate={p.truncateProp === 'disabled' ? undefined : p.truncateProp} {...p} {...p.customProps}>
		{p.children || p.stringValue || p.numberValue}
	</Anchor>
))
