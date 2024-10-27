import { MantineNumberSize } from '@mantine/core'
import type { BaseReactProps } from '@shared/node'

export type Props = BaseReactProps & {
	mounted: bool
	selectionScope: TableSelectionScopeValues
	newSelectionScope: TableSelectionScopeValues
}
