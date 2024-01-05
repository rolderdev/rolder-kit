import { TableCompProps } from "../../../types/TableCompProps";
import { MRT_TableOptions, MRT_VisibilityState } from "mantine-react-table";
import { Sx } from "@mantine/core";
import convertColor from "../../../../../../../../../utils/convertColor/v0.2.0/convertColor";
import cellStyle from "../cell/cellStyle";
import { useAtomValue, useSetAtom } from "jotai";
import { selectItemAtom, selectedItemAtom } from "../../../selection/singleSelection";
import { getSelectedAtom } from "../../../selection/multiSelection";
import { hoveredRowIdAtom } from "../../../Table";
import { ColumnDef, GroupScheme } from "../../../types/Column";
import Cell from "../cell/GroupedCell";
import GroupHeader from "../header/GroupHeader";

export default function (tableProps: TableCompProps, tableSharedParams: Partial<MRT_TableOptions<RItem>>) {
    const {
        noodlNode, columns, singleSelectable, rowBackgroundColor, highlightOnHover, onHoverColor, highlightSelectedRow, selectedRowColor,
        singleUnselectable
    } = tableProps
    const setHoveredRowId = useSetAtom(hoveredRowIdAtom)


    const groupColumnDef: ColumnDef | undefined = columns.find(i => i.groupScheme)
    const groupScheme: GroupScheme[] | undefined = groupColumnDef?.groupScheme
    let colVis: MRT_VisibilityState = {}
    if (groupColumnDef && groupScheme) {
        colVis[groupColumnDef.header] = false
        groupScheme.forEach(i => { colVis[i.groupBy] = false })
        const groupedParams: Partial<MRT_TableOptions<RItem>> = {
            state: {
                ...tableSharedParams.state,
                columnVisibility: colVis,
                grouping: groupScheme?.map(i => i.groupBy)
            },
            enableGrouping: true,
            displayColumnDefOptions: {
                'mrt-row-expand': {
                    Header: ({ table }) => GroupHeader(tableProps, groupColumnDef, table),
                    Cell: ({ table, row, cell }) => Cell(tableProps, groupColumnDef, table, row, cell),
                },
            },
            mantineTableBodyRowProps: ({ row }) => {
                let props: any = {}
                let sx: Sx = {}
                const selectedItem = useAtomValue(selectedItemAtom)
                const selectedItemsState = useAtomValue(getSelectedAtom)
                const selectItem = useSetAtom(selectItemAtom)
                if (highlightOnHover && onHoverColor) sx['&:hover td'] = { backgroundColor: convertColor(onHoverColor) }
                if (highlightOnHover === undefined) sx['&:hover td'] = { backgroundColor: convertColor(rowBackgroundColor) }
                if (highlightSelectedRow && !row.getIsGrouped() &&
                    !tableProps.tableLoading &&
                    (selectedItem?.id === row.original.id || selectedItemsState[row.original.id])
                ) sx['& td'] = { backgroundColor: convertColor(selectedRowColor) }
                if (singleSelectable || tableProps.expendOn === 'row') {
                    sx.cursor = tableProps.expendOn === 'row' && row.getIsGrouped()
                        ? 'pointer'
                        : !row.getIsGrouped()
                            ? 'pointer'
                            : 'default'
                    props.onClick = () => {
                        if (row.getIsGrouped()) {
                            if (tableProps.expendOn === 'row') row.toggleExpanded()
                        } else {
                            if (selectedItem?.id === row.original.id) {
                                if (singleUnselectable) selectItem(noodlNode)
                            } else selectItem(noodlNode, row)
                        }
                    }
                }
                props.onMouseOver = () => setHoveredRowId(row.id)
                props.onMouseLeave = () => setHoveredRowId('')
                return { ...props, sx }
            },
            mantineTableBodyCellProps: ({ column, row }) => cellStyle(tableProps, column, row),
        }

        return groupedParams
    }
}
/* if (highlightSelected && singleSelection === row.id) returnProps.sx['& td'] = { backgroundColor: convertColor(selectedColor) }

if (singleSelect || row.getIsGrouped()) returnProps.sx.cursor = 'pointer'
if (singleSelect && !row.getIsGrouped()) returnProps.onClick = () => {
    if (singleSelection !== row.id) setSingleSelection(row.id)
    else if (singleUnselectable) setSingleSelection('')
}
if (grouped && row.getIsGrouped()) returnProps.onClick = () => { if (row.getIsGrouped()) row.toggleExpanded(!row.getIsExpanded()) } */