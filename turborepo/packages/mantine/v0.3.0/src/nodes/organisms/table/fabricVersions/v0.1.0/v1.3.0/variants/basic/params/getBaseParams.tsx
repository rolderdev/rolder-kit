import { TableCompProps } from "../../../types/TableCompProps";
import { MRT_TableOptions } from "mantine-react-table";
import { Sx } from "@mantine/core";
import convertColor from "../../../../../../../../../utils/convertColor/v0.2.0/convertColor";
import cellStyle from "../cell/cellStyle";
import { useAtomValue, useSetAtom } from "jotai";
import { getSelectedAtom } from "../../../selection/multiSelection";
import { hoveredRowId } from "../../../params/getSharedParams";
import { selectItemAtom, selectedItemAtom } from "../../../selection/singleSelection";
import { RItem } from "@rk/types";

export default function (tableProps: TableCompProps) {
    const {
        noodlNode, singleSelectable, rowBackgroundColor, highlightOnHover, onHoverColor, highlightSelectedRow, selectedRowColor,
        singleUnselectable
    } = tableProps

    const baseParams: Partial<MRT_TableOptions<RItem>> = {
        mantineTableBodyRowProps: ({ row }) => {
            let props: any = {}
            let sx: Sx = {}
            const selectedItem = useAtomValue(selectedItemAtom)
            const selectItem = useSetAtom(selectItemAtom)
            const selectedItemsState = useAtomValue(getSelectedAtom)
            if (highlightOnHover && onHoverColor) sx['&:hover td'] = { backgroundColor: convertColor(onHoverColor) }
            if (highlightOnHover === undefined) sx['&:hover td'] = { backgroundColor: convertColor(rowBackgroundColor) }
            if (highlightSelectedRow &&
                !tableProps.tableLoading &&
                (selectedItem?.id === row.original.id || selectedItemsState[row.original.id])
            ) sx['& td'] = { backgroundColor: convertColor(selectedRowColor) }
            if (singleSelectable) {
                sx.cursor = 'pointer'
                props.onClick = () => {
                    if (selectedItem?.id !== row.id) selectItem(noodlNode, row)
                    else if (singleUnselectable) selectItem(noodlNode)
                }

            }
            const hasHoverableActions = tableProps.columns.some(i => i.hoverableActions)
            if (hasHoverableActions) {
                props.onMouseOver = () => hoveredRowId.set(row.id)
                props.onMouseLeave = () => hoveredRowId.set('')
            }
            return { ...props, sx }
        },
        mantineTableBodyCellProps: ({ column, row }) => cellStyle(tableProps, column, row),
    }

    return baseParams
}