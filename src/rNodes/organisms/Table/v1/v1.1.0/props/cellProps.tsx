import { Column } from "../types/Column";
import { TableCompProps } from "../types/TableCompProps";
import { convertColor } from "../../../../../../utils/converters/v0.1.0/converters";
import { MRT_Row } from "mantine-react-table";
import { Sx } from "@mantine/core";
import { getValue } from "../../../../../../utils/data/v0.3.0/data";

export default function (props: { tableProps: TableCompProps, columnDef: Column, row: MRT_Row<NItem> }) {
    const { backgroundColor, loading } = props.tableProps
    const { columnDef, row } = props
    const grouping = columnDef?.groupScheme?.map(i => i.groupBy)

    let sx: Sx = {}
    if (props.columnDef.cellProps) sx = props.columnDef.cellProps
    const colorMap = props.columnDef.cellProps?.colorMap
    if (colorMap) sx.color = colorMap.map[getValue(row.original, colorMap.accessor)]
    if (props.columnDef.wrap) sx.whiteSpace = 'pre-line'
    if (backgroundColor) {
        const maxDepth = backgroundColor?.split('.')[1] ? parseInt(backgroundColor.split('.')[1]) : grouping?.length || 0
        const bgColor = backgroundColor ? backgroundColor?.split('.')[0] : 'blue'
        if (!loading) {
            if (row.getIsExpanded() && row.depth === 0) sx.backgroundColor = convertColor(`${bgColor}.${maxDepth}`)
            if (row.getIsGrouped() && row.depth > 0) sx.backgroundColor = convertColor(`${bgColor}.${maxDepth - row.depth}`)
            if (!row.getIsGrouped()) sx.backgroundColor = convertColor(`${bgColor}.${maxDepth - row.depth}`)
        }
    }

    return { sx }
}