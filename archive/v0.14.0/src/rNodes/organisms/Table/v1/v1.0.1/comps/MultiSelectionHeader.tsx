import { Checkbox, Group, MantineColor, MantineStyleSystemProps } from "@mantine/core"
import { MRT_Column } from "mantine-react-table"

export function MultiSelectionHeader(props: {
    allSelected: boolean, partialSelected: boolean, column: MRT_Column<Item>, header?: string, allSelectionHandler: any,
    multiSelectCheckboxColor: MantineColor, loading: boolean, ml?: MantineStyleSystemProps['ml'], multiSelect: boolean, allSelect: boolean
}) {
    const { column, header, multiSelectCheckboxColor, allSelectionHandler, loading, ml, allSelected, partialSelected, multiSelect, allSelect } = props

    return (
        <Group noWrap>
            {multiSelect && allSelect && <Checkbox
                color={multiSelectCheckboxColor}
                checked={allSelected && !loading}
                indeterminate={partialSelected}
                ml={ml}
                onChange={(e) => allSelectionHandler(e.currentTarget.checked)}
                onClick={(e) => e.stopPropagation()}
            />}
            {header || column.columnDef.header}
        </Group>
    )
}