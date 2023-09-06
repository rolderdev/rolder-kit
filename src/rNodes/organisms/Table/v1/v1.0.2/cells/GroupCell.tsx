import { Checkbox, Group, Text, createStyles } from "@mantine/core"
import { MRT_Cell, MRT_Row } from "mantine-react-table"
import useAction from "../hooks/useAction"
import { Column } from "../types/Column"
import { Selection } from "../types/Selection"
import { TableCompProps } from "../types/TableCompProps"
import icons from "../../../../../../libs/icons/v0.2.0/icons"

const IconChevronDown = icons('IconChevronDown')
const useStyles = createStyles(() => ({
    expandIcon: {
        transition: 'transform 0.15s ease',
    },
    expandIconRotated: {
        transform: 'rotate(0.5turn)',
    },
}))

export default function (props: {
    tableProps: TableCompProps, selectionProps: Selection, row: MRT_Row<Item>, cell: MRT_Cell<Item>, columnDef: Column,
}) {
    const { row, cell, columnDef: leafColumnDef, tableProps, selectionProps } = props
    const { multiSelect, multiSelectCheckboxColor, tableDensity } = tableProps
    const { multiSelection, setMultiSelection } = selectionProps
    const { cx, classes } = useStyles()
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

    if (!multiSelect) {
        if (row.getIsGrouped()) margins.value = 5
        else margins.cell = 37 + cellOffset
    }
    if (multiSelect) {
        if (row.getIsGrouped()) {
            margins.cell = cellOffset
            margins.checkBox = 5 + checkBoxOffset
        } else {
            if (parentGroupScheme?.multiselect) {
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
    if (multiSelect && row.getIsGrouped() && groupScheme?.multiselect) checkboxEnabled = true
    if (!row.getIsGrouped() && multiSelect) checkboxEnabled = true

    const notGroupedLeafRows = row.getLeafRows().filter((row) => !row.getIsGrouped())
    const selectedLeafsCount = notGroupedLeafRows.filter((row) => multiSelection[row.id]).length
    const allSelected = selectedLeafsCount === notGroupedLeafRows.length
    const hasSomeSelected = selectedLeafsCount > 0 && !allSelected


    // value
    let value: any = cell.getValue<string>()
    if (row.getIsGrouped()) value = row.groupingValue
    else if (leafColumnDef) value = row.getAllCells().find(i => i.column.columnDef.header === leafColumnDef?.header)?.getValue<string>()

    // actions
    const leafActions = leafColumnDef.actions?.map(i => { return useAction({ actionDef: i, row, tableProps, selectionProps }) })
    const groupActions = groupScheme?.actions?.map(i => { return useAction({ actionDef: i, row, tableProps, selectionProps }) })
    const hasAction = leafActions?.length || groupActions?.length
    const actions = row.getIsGrouped() ? groupActions : leafActions

    return <Group ml={margins.cell} position={hasAction ? 'apart' : 'left'} noWrap>
        <Group noWrap>
            {row.getIsGrouped() && <IconChevronDown
                size={16}
                className={cx(classes.expandIcon, { [classes.expandIconRotated]: row.getIsExpanded() })}
            />}
            {checkboxEnabled && <Checkbox
                ml={margins.checkBox}
                color={multiSelectCheckboxColor}
                checked={row.getIsGrouped() ? allSelected : multiSelection[row.id]}
                indeterminate={hasSomeSelected}
                onChange={(e) => {
                    if (row.getIsGrouped()) setMultiSelection(notGroupedLeafRows.reduce((a: any, v: any) =>
                        ({ ...a, [v.id]: e.currentTarget.checked }), {}))
                    else setMultiSelection({ [row.id]: e.currentTarget.checked })
                }}
                onClick={(e) => e.stopPropagation()}
            />}
            <Text ml={margins.value}>{value}</Text>
        </Group>
        {!tableProps.loading && actions}
    </Group>
}