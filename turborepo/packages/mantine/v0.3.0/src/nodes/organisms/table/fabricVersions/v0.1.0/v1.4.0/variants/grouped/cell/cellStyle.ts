import { Sx } from "@mantine/core"
import { MRT_Column, MRT_Row } from "mantine-react-table"
import { ColumnDef } from "../../../types/Column"
import { RItem } from "@rk/types"
import { getValue8 } from "@rk/utils"

export default function (column: MRT_Column<RItem>, row: MRT_Row<RItem>) {
    const cellDef = column.columnDef.cell as ColumnDef['cell']

    let sx: Sx = {}
    const colorMap = cellDef?.colorMap
    if (colorMap) sx.color = colorMap.map[getValue8(row.original, colorMap.accessor)]
    sx.whiteSpace = 'nowrap'
    return { sx: { ...cellDef?.style, ...sx } }
}