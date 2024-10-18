import { UnstyledButton } from '@mantine/core'
import { getCompProps } from '@packages/get-comp-props'
import { sendSignal } from '@packages/port-send'
import { useTableCellScope } from '@packages/scope'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => {
	const item = useTableCellScope()
	const p = { ...getCompProps(props, item) } as Props

	return (
		<UnstyledButton
			onClick={(e) => {
				e.stopPropagation()
				sendSignal(props.noodlNode, 'clicked')
			}}
			{...p}
			{...p.customProps}
		>
			{p.children}
		</UnstyledButton>
	)
})
