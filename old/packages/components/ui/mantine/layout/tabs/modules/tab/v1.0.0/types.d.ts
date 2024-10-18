import type { TabProps } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
	value: TabProps['value']
	label?: string
	iconName?: string
	iconSize?: string
	iconStroke?: number
	iconColor?: string
}
