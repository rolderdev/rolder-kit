import { Sx } from "@mantine/core"
import { MRT_Column, MRT_Row } from "mantine-react-table"
import { TableCompProps } from "../../../types/TableCompProps"
import convertColor from "../../../../../../../../../utils/convertColor/v0.2.0/convertColor"
import { ColumnDef } from "../../../types/Column"

export default function (tableProps: TableCompProps, column: MRT_Column<RItem>, row: MRT_Row<RItem>) {
    const { getValue } = window.R.utils
    const cellDef = column.columnDef.cell as ColumnDef['cell']

    let props: any = {}
    let sx: Sx = {}
    const colorMap = cellDef?.colorMap
    if (colorMap) sx.color = colorMap.map[getValue.v8(row.original, colorMap.accessor)]
    sx.backgroundColor = convertColor(tableProps.rowBackgroundColor ? tableProps.rowBackgroundColor : cellDef?.style?.backgroundColor)
    sx.whiteSpace = 'nowrap'
    return { ...props, sx: { ...cellDef?.style, ...sx } }
}