import { forwardRef, useEffect, useState } from 'react'
import type { Props } from './types'
import { Tabs } from '@mantine/core'
import { getCompProps } from '@packages/get-comp-props'

export default forwardRef((props: Props) => {
	const p = { ...getCompProps(props) } as Props

	const [activeTab, setActiveTab] = useState<string | null>()
	useEffect(() => setActiveTab(props.value), [props.value])

	return (
		<Tabs
			onTabChange={setActiveTab}
			variant={p.tabsVariant}
			orientation={p.tabsOrientation}
			{...p}
			{...p.customProps}
			value={activeTab}
		>
			<Tabs.List position={p.tabsPosition} {...p} {...p.customProps}>
				{props.children}
			</Tabs.List>
		</Tabs>
	)
})
