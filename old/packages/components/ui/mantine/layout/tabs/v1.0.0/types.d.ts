import type { TabsListProps, TabsProps } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
	value: TabsProps['value']
	tabsVariant: TabsProps['variant']
	tabsOrientation: TabsProps['orientation']
	tabsPosition: TabsListProps['position']
	grow: TabsListProps['grow']
}
