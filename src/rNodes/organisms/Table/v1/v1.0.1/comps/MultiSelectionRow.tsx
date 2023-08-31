import { Checkbox, Group, MantineColor, createStyles } from "@mantine/core"
import { MRT_Cell, MRT_Row, MRT_RowSelectionState } from "mantine-react-table"
import icons from "../../../../../../libs/icons/v0.2.0/icons"
import { Column } from "../types/Column"
import useAction from "../hooks/useAction"
import { NodeInstance } from "@noodl/noodl-sdk"

const IconChevronDown = icons('IconChevronDown')
// expand animation
const useStyles = createStyles(() => ({
    expandIcon: {
        transition: 'transform 0.15s ease',
    },
    expandIconRotated: {
        transform: 'rotate(0.5turn)',
    },
}))

export function MultiSelectionRow(props: {
    row: MRT_Row<Item>, cell: MRT_Cell<Item>, multiSelection: MRT_RowSelectionState, multiSelectCheckboxColor: MantineColor,
    setMultiSelection: any, groupColumnDef?: Column, multiSelect: boolean, noodlNode: NodeInstance, grouped: boolean, loading: boolean
}) {
    const { row, cell, multiSelection, multiSelectCheckboxColor, setMultiSelection, groupColumnDef, multiSelect, noodlNode, grouped, loading } = props
    const notGroupedLeafRows = row.getLeafRows().filter((row) => !row.getIsGrouped())
    const selectedLeafsCount = notGroupedLeafRows.filter((row) => multiSelection[row.id]).length
    const allSelected = selectedLeafsCount === notGroupedLeafRows.length
    const hasSomeSelected = selectedLeafsCount > 0 && !allSelected

    const { cx, classes } = useStyles()

    let value: any = ''
    if (row.getIsGrouped()) value = row.groupingValue
    else if (groupColumnDef) value = row.getAllCells().find(i => i.column.columnDef.header === groupColumnDef?.header)?.getValue() || ''
    else value = cell.getValue()

    const columnDef: any = cell.column.columnDef
    const groupSchemeCellProps = groupColumnDef?.groupShceme?.find(i => i.groupBy === row.groupingColumnId)?.cellProps
    let ml = columnDef.cellProps?.ml || 0
    if (row.getIsGrouped()) ml = groupSchemeCellProps?.ml || 0
    let checkboxEnabled = false
    if (multiSelect && row.getIsGrouped() && groupSchemeCellProps?.multiselect) checkboxEnabled = true
    if (!row.getIsGrouped() && multiSelect) {
        checkboxEnabled = true
        ml = groupColumnDef?.cellProps?.ml || 0
    }

    let actions: any = <></>
    if (grouped && !row.getIsGrouped()) actions = groupColumnDef?.actions.map(i => { return useAction({ noodlNode, actionDef: i, row }) })
    if (!grouped) actions = columnDef?.actions.map((i: any) => { return useAction({ noodlNode, actionDef: i, row }) })

    return (
        <Group position={actions?.length ? 'apart' : 'left'} noWrap >
            <Group ml={ml} noWrap>
                {checkboxEnabled && <Checkbox
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
                {row.getIsGrouped() && <IconChevronDown
                    size={16}
                    className={cx(classes.expandIcon, { [classes.expandIconRotated]: row.getIsExpanded() })}
                />}
                {value}
            </Group>
            {!loading && actions}
        </Group>
    )
}