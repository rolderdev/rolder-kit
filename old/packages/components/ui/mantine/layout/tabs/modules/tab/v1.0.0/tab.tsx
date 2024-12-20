import { Tabs } from '@mantine/core'
import convertColor from '@packages/convert-color'
import { getCompProps } from '@packages/get-comp-props'
import { sendSignal } from '@packages/port-send'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => {
	const p = { ...getCompProps(props) } as Props

	const Icon = p.iconName && R.libs.icons[p.iconName]

	return (
		<Tabs.Tab
			icon={Icon && <Icon size={p.iconSize} stroke={p.iconStroke} color={convertColor(p.iconColor)} />}
			onClick={() => sendSignal(props.noodlNode, 'clicked')}
			{...p}
			{...p.customProps}
		>
			{p.label}
		</Tabs.Tab>
	)
})
