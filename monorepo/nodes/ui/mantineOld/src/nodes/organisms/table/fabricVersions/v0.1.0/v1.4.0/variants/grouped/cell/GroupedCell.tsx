import { ColumnDef } from "../../../types/Column";
import { ActionIcon, Checkbox, Group, Skeleton, createStyles } from "@mantine/core";
import { TableCompProps } from "../../../types/TableCompProps";
import { MRT_Cell, MRT_Row, MRT_TableInstance } from "mantine-react-table";
import Value from "../../../cell/Value";
import icons from "../../../../../../../../../libs/icons/v0.2.0/icons";
import { useAtomValue, useSetAtom } from "jotai";
import { getSelectedAtom, setSelectionAtom } from "../../../selection/multiSelection";
import useAction from "../../../actions/useAction";

const IconChevronDown = icons('IconChevronDown')
const useStyles = createStyles(() => ({
    expandIcon: {
        transition: 'transform 0.15s ease',
    },
    expandIconRotated: {
        transform: 'rotate(0.5turn)',
    },
}))

export default function (
    tableProps: TableCompProps, leafColumnDef: ColumnDef, table: MRT_TableInstance<RItem>, row: MRT_Row<RItem>, cell: MRT_Cell<RItem>,
) {
    const { cx, classes } = useStyles()
    const { noodlNode, multiSelectable, multiSelectCheckboxColor, tableDensity, tableLoading } = tableProps

    const groupScheme = leafColumnDef?.groupScheme?.find(i => i.groupBy === row.groupingColumnId)
    const parentGroupScheme = leafColumnDef?.groupScheme?.[row.depth - 1]

    ///////// multiselect    
    // margins
    let margins = {
        cell: 0,
        checkBox: 0,
        value: 0
    }
    let cellOffset = 1
    let checkBoxOffset = 0
    switch (tableDensity) {
        case 'md': {
            cellOffset = 6
            checkBoxOffset = 1
        } break
        case 'xl': {
            cellOffset = 14
            checkBoxOffset = 1
        } break
    }

    if (!multiSelectable) {
        if (row.getIsGrouped()) margins.value = 5
        else margins.cell = 37 + cellOffset
    }
    if (multiSelectable) {
        if (row.getIsGrouped()) {
            margins.cell = cellOffset
            margins.checkBox = 5 + checkBoxOffset
        } else {
            if (parentGroupScheme?.multiSelectable) {
                margins.cell = 40 + cellOffset
                margins.value = -4
            } else {
                margins.cell = 5 + cellOffset
                margins.value = -4
            }
        }
    }

    // checkboxes
    let checkboxEnabled = false
    if (multiSelectable && row.getIsGrouped() && groupScheme?.multiSelectable) checkboxEnabled = true
    if (!row.getIsGrouped() && multiSelectable && cell?.column?.id === 'mrt-row-expand') checkboxEnabled = true

    const selectedItems = useAtomValue(getSelectedAtom)
    const setSelection = useSetAtom(setSelectionAtom)
    const notGroupedLeafRows = row.getLeafRows().filter((row) => !row.getIsGrouped())
    const selectedLeafsCount = notGroupedLeafRows.filter((row) => selectedItems[row.id]).length
    const allSelected = selectedLeafsCount === notGroupedLeafRows.length
    const hasSomeSelected = selectedLeafsCount > 0 && !allSelected

    // value
    let value: any
    if (row.getIsGrouped()) value = row.getAllCells().find(i => i.column.id === groupScheme?.groupBy)?.renderValue()
    else if (leafColumnDef) value = row.getAllCells().find(i => i.column.columnDef.header === leafColumnDef?.header)?.renderValue()

    const actions = !row.getIsGrouped()
        ? leafColumnDef.actions?.map(i => { return useAction(tableProps, i, row, leafColumnDef.hoverableActions || false) })
        : []
    const position = leafColumnDef.actionsOnly ? 'center' : actions?.length ? 'apart' : 'left'

    return <Skeleton visible={tableLoading}>
        <Group w={leafColumnDef.size ? leafColumnDef.size : undefined} ml={margins.cell} position={position} noWrap>
            <Group noWrap>
                {row.getIsGrouped() && tableProps.expandOn === 'row'
                    ? <IconChevronDown
                        size={20}
                        className={cx(classes.expandIcon, { [classes.expandIconRotated]: row.getIsExpanded() })}
                    />
                    : row.getIsGrouped() && <ActionIcon
                        color='dark'
                        my={-6}
                        onClick={(e) => {
                            e.stopPropagation()
                            row.toggleExpanded()
                        }}
                    >
                        <IconChevronDown
                            size={20}
                            className={cx(classes.expandIcon, { [classes.expandIconRotated]: row.getIsExpanded() })}
                        />
                    </ActionIcon>
                }
                {checkboxEnabled && <Checkbox
                    ml={margins.checkBox}
                    color={multiSelectCheckboxColor}
                    checked={row.getIsGrouped() ? allSelected : selectedItems[row.id]}
                    indeterminate={hasSomeSelected}
                    onChange={(e) => {
                        if (row.getIsGrouped()) notGroupedLeafRows.forEach(i => {
                            setSelection(noodlNode, table, i.original.id, e.currentTarget.checked)
                        })
                        else setSelection(noodlNode, table, row.original.id, e.currentTarget.checked)
                    }}
                    onClick={(e) => e.stopPropagation()}
                />}
                {Value(groupScheme || leafColumnDef, value)}
            </Group>
            <Group position='right' noWrap>{actions}</Group>
        </Group >
    </Skeleton>
}