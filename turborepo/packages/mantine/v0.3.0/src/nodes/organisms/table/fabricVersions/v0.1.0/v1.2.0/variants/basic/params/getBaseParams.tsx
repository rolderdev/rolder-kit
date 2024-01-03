import { TableCompProps } from "../../../types/TableCompProps";
import { MRT_TableOptions } from "mantine-react-table";
import { Sx } from "@mantine/core";
import convertColor from "../../../../../../../../../utils/convertColor/v0.2.0/convertColor";
import cellStyle from "../cell/cellStyle";
import { useAtomValue, useSetAtom } from "jotai";
import { selectItemAtom, selectedItemAtom } from "../../../selection/singleSelection";
import { getSelectedAtom } from "../../../selection/multiSelection";
import { hoveredRowIdAtom } from "../../../Table";
import { RItem } from "@rk/types";

export default function (tableProps: TableCompProps) {
    const {
        noodlNode, singleSelectable, rowBackgroundColor, highlightOnHover, onHoverColor, highlightSelectedRow, selectedRowColor,
        singleUnselectable
    } = tableProps

    const setHoveredRowId = useSetAtom(hoveredRowIdAtom)

    const baseParams: Partial<MRT_TableOptions<RItem>> = {
        mantineTableBodyRowProps: ({ row }) => {
            let props: any = {}
            let sx: Sx = {}
            const selectedItem = useAtomValue(selectedItemAtom)
            const selectedItemsState = useAtomValue(getSelectedAtom)
            const selectItem = useSetAtom(selectItemAtom)
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
            props.onMouseOver = () => setHoveredRowId(row.id)
            props.onMouseLeave = () => setHoveredRowId('')
            return { ...props, sx }
        },
        mantineTableBodyCellProps: ({ column, row }) => cellStyle(tableProps, column, row),
    }

    return baseParams
}