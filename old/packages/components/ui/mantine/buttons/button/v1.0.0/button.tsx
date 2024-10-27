import { Button } from '@mantine/core'
import convertColor from '@packages/convert-color'
import { getCompProps } from '@packages/get-comp-props'
import { sendSignal } from '@packages/port-send'
import { useTableCellScope } from '@packages/scope'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props, ref: any) => {
	const item = useTableCellScope()
	const p = { ...getCompProps(props, item) } as Props

	const Icon = p.iconName && R.libs.icons[p.iconName]

	return (
		<Button
			type={p.buttonType}
			variant={p.buttonVariant}
			leftIcon={Icon && <Icon size={p.iconSize} stroke={p.iconStroke} color={convertColor(p.iconColor)} />}
			onClick={(e) => {
				e.stopPropagation()
				sendSignal(props.noodlNode, 'clicked')
			}}
			ref={ref}
			{...p}
			{...p.customProps}
		>
			{p.label}
		</Button>
	)
})
