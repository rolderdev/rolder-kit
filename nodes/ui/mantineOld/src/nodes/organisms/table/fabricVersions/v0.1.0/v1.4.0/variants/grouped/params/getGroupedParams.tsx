import { TableCompProps } from "../../../types/TableCompProps";
import { MRT_TableOptions, MRT_VisibilityState } from "mantine-react-table";
import { Sx } from "@mantine/core";
import convertColor from "../../../../../../../../../utils/convertColor/v0.2.0/convertColor";
import cellStyle from "../cell/cellStyle";
import { useAtomValue, useSetAtom } from "jotai";
import { getSelectedAtom } from "../../../selection/multiSelection";
import { ColumnDef, GroupScheme } from "../../../types/Column";
import GroupedCell from "../cell/GroupedCell";
import GroupHeader from "../header/GroupHeader";
import { hoveredRowId } from "../../../params/getSharedParams";
import { selectItemAtom, selectedItemAtom } from "../../../selection/singleSelection";
import { selectGroupedItemAtom, selectedGroupedItemAtom } from "../../../selection/singleGroupedSelection";

export default function (tableProps: TableCompProps, tableSharedParams: Partial<MRT_TableOptions<RItem>>) {
    const { get } = window.R.libs.just
    const {
        noodlNode, columns, singleSelectable, rowBackgroundColor, highlightOnHover, onHoverColor, highlightSelectedRow, selectedRowColor,
        singleUnselectable, tableLoading, groupedRowSelectable, groupedRowUnselectable, highlightSelectedGroupedRow,
        selectedGroupedRowColor
    } = tableProps

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
                    Cell: ({ table, row, cell }) => GroupedCell(tableProps, groupColumnDef, table, row, cell)
                },
            },
            mantineTableBodyRowProps: ({ row }) => {
                let props: any = {}
                let sx: Sx = {}
                const selectedItem = useAtomValue(selectedItemAtom)
                const selectItem = useSetAtom(selectItemAtom)
                const selectedGroupedItem = useAtomValue(selectedGroupedItemAtom)
                const selectGroupedItem = useSetAtom(selectGroupedItemAtom)
                const selectedItemsState = useAtomValue(getSelectedAtom)

                if (!tableLoading) {
                    if (highlightOnHover && onHoverColor) sx['&:hover td'] = { backgroundColor: convertColor(onHoverColor) }
                    if (!row.getIsGrouped()) sx['& td'] = { backgroundColor: convertColor(rowBackgroundColor) }
                    if (row.getIsExpanded() && groupScheme[row.depth]?.expandedBackgroundColor)
                        sx['& td'] = { backgroundColor: convertColor(groupScheme[row.depth]?.expandedBackgroundColor) }
                    if (!row.getIsExpanded() && groupScheme[row.depth]?.backgroundColor)
                        sx['& td'] = { backgroundColor: convertColor(groupScheme[row.depth]?.backgroundColor) }
                    if (highlightSelectedRow && !row.getIsGrouped() && !tableProps.tableLoading &&
                        (selectedItem?.id === row.original.id || selectedItemsState[row.original.id])
                    ) sx['& td'] = { backgroundColor: convertColor(selectedRowColor) }

                    const groupBy = groupScheme[row.depth]?.groupBy
                    if (groupBy) {                        
                        if (highlightSelectedGroupedRow && row.getIsGrouped() && !tableProps.tableLoading &&
                            (selectedGroupedItem?.id === get(row.original, groupScheme[row.depth].groupBy)
                                || selectedItemsState[row.original.id])
                        ) sx['& td'] = { backgroundColor: convertColor(selectedGroupedRowColor) }
                    }

                    switch (true) {
                        case tableProps.expandOn === 'row' && row.getIsGrouped(): {
                            sx.cursor = 'pointer'
                            props.onClick = () => row.toggleExpanded()
                        } break
                        case tableProps.expandOn === 'icon' && row.getIsGrouped() && groupedRowSelectable: {
                            sx.cursor = 'pointer'
                            props.onClick = () => {
                                if (groupBy && selectedGroupedItem?.id === get(row.original, groupScheme[row.depth].groupBy)) {
                                    if (groupedRowUnselectable) selectGroupedItem(noodlNode)
                                } else selectGroupedItem(noodlNode, row, groupScheme[row.depth].accessor.split('.').slice(1))
                            }
                        } break
                        case !row.getIsGrouped() && singleSelectable: {
                            sx.cursor = 'pointer'
                            props.onClick = () => {
                                if (selectedItem?.id === row.original.id) {
                                    if (singleUnselectable) selectItem(noodlNode)
                                } else selectItem(noodlNode, row)
                            }
                        } break
                    }

                    const hasHoverableActions = tableProps.columns.some(i => i.hoverableActions)
                    if (hasHoverableActions) {
                        props.onMouseOver = () => hoveredRowId.set(row.id)
                        props.onMouseLeave = () => hoveredRowId.set('')
                    }
                }

                return { ...props, sx }
            },
            mantineTableBodyCellProps: ({ column, row }) => cellStyle(column, row),
        }

        return groupedParams
    }
}