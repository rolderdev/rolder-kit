import { MantineNumberSize } from "@mantine/core";
import { BaseReactProps } from '@shared/node'

export type Props = BaseReactProps & {
    mounted: bool,
    selectionScope: TableSelectionScopeValues,
    newSelectionScope: TableSelectionScopeValues,
    indeterminatedItems: string[]
}
