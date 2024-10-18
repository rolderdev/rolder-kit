import { ActionIcon } from '@mantine/core'
import convertColor from '@packages/convert-color'
import { getCompProps } from '@packages/get-comp-props'
import { sendSignal } from '@packages/port-send'
import { useTableCellScope } from '@packages/scope'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => {
	const item = useTableCellScope()
	const p = { ...getCompProps(props, item) } as Props

	const Icon = p.iconName && R.libs.icons[p.iconName]

	return (
		<ActionIcon
			onClick={(e) => {
				e.stopPropagation()
				sendSignal(props.noodlNode, 'clicked')
			}}
			variant={p.actionIconVariant}
			{...p}
			{...p.customProps}
		>
			{Icon ? <Icon size={p.iconSize} stroke={p.iconStroke} color={convertColor(p.iconColor)} /> : null}
		</ActionIcon>
	)
})
