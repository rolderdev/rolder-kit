import { UnstyledButton } from '@mantine/core'
import { sendSignal } from '@shared/port-send-v1.0.0'
import { forwardRef } from 'react'
import type { Props } from '../node/definition'

export default forwardRef((p: Props) => (
	<UnstyledButton
		onClick={(e) => {
			e.stopPropagation()
			sendSignal(p.noodlNode, 'clicked')
		}}
		{...p}
		{...p.customProps}
	>
		{p.children}
	</UnstyledButton>
))
