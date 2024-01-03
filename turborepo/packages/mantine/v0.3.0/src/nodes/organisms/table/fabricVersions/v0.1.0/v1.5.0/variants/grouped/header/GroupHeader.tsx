import { ActionIcon, Checkbox, Group, Text, createStyles } from "@mantine/core"
import { TableCompProps } from "../../../types/TableCompProps"
import { ColumnDef } from "../../../types/Column"
import { MRT_TableInstance } from "mantine-react-table"
import { useAtomValue, useSetAtom } from "jotai"
import { selectionStateAtom, selectAllAtom } from "../../../selection/multiSelection"
import icons from "../../../../../../../../../libs/icons/v0.2.0/icons"
import { RItem } from "@rk/types"

const IconChevronDown = icons('IconChevronDown')
const useStyles = createStyles(() => ({
    expandIcon: {
        transition: 'transform 0.15s ease',
    },
    expandIconRotated: {
        transform: 'rotate(0.5turn)',
    },
}))

export default function (tableProps: TableCompProps, columnDef: ColumnDef, table: MRT_TableInstance<RItem>) {
    const { noodlNode, allSelectable, multiSelectCheckboxColor, tableLoading, items, expandAllAction } = tableProps
    const { cx, classes } = useStyles()
    const hasData = items?.length > 0

    const selectionState = useAtomValue(selectionStateAtom)
    const selectAll = useSetAtom(selectAllAtom)

    // margins
    let margins = {
        cell: 0,
        value: 0
    }
    if (!expandAllAction && !allSelectable) margins.cell = 10
    if (expandAllAction && !allSelectable) margins.value = -4
    if (!expandAllAction && allSelectable) margins.cell = 11

    // all expanded state
    let allExpanded = false
    if (!tableLoading) allExpanded = table.getExpandedRowModel().rows.length === Object.keys(table.getExpandedRowModel().rowsById).length

    return <Group ml={margins.cell} noWrap>
        {expandAllAction && <ActionIcon
            ml={3}
            my={-6}
            color="dark"
            onClick={() => table.toggleAllRowsExpanded(!allExpanded)}
            disabled={!hasData}
        >
            <IconChevronDown
                size={20}
                className={cx(classes.expandIcon, { [classes.expandIconRotated]: allExpanded })}
            />
        </ActionIcon>}
        {allSelectable && <Checkbox
            ml={-4}
            color={multiSelectCheckboxColor}
            checked={selectionState === 'all' && !tableLoading}
            indeterminate={selectionState === 'partial'}
            onChange={() => selectAll(noodlNode, table)}
            onClick={(e) => e.stopPropagation()}
            disabled={!hasData}
        />}
        <Text ml={margins.value}>{columnDef.header}</Text>
    </Group>
}