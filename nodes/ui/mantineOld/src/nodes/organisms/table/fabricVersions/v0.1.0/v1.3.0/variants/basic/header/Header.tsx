import { Checkbox, Group, Text } from "@mantine/core"
import { TableCompProps } from "../../../types/TableCompProps"
import { ColumnDef } from "../../../types/Column"
import { MRT_TableInstance } from "mantine-react-table"
import { useAtomValue, useSetAtom } from "jotai"
import { selectionStateAtom, selectAllAtom } from "../../../selection/multiSelection"

export default function (tableProps: TableCompProps, columnDef: ColumnDef, table: MRT_TableInstance<RItem>,) {
    const { noodlNode, allSelectable, multiSelectCheckboxColor, tableLoading, items } = tableProps
    const hasData = items?.length > 0

    const selectionState = useAtomValue(selectionStateAtom)
    const selectAll = useSetAtom(selectAllAtom)

    return <Group noWrap>
        {allSelectable && table._getColumnDefs()[0].header === columnDef.header && <Checkbox
            color={multiSelectCheckboxColor}
            checked={selectionState === 'all' && !tableLoading}
            indeterminate={selectionState === 'partial'}
            onChange={() => selectAll(noodlNode, table)}
            onClick={(e) => e.stopPropagation()}
            disabled={!hasData}
        />}
        <Text>{columnDef.header}</Text>
    </Group>
}