import { Column } from "../types/Column";
import { TableCompProps } from "../types/TableCompProps";
import { convertColor } from "../../../../../../utils/converters/v0.1.0/converters";
import { MRT_Row } from "mantine-react-table";

export default function (props: { tableProps: TableCompProps, columnDef: Column, row: MRT_Row<Item> }) {
    const { backgroundColor, loading } = props.tableProps
    const { columnDef, row } = props
    const grouping = columnDef?.groupScheme?.map(i => i.groupBy)

    let returnProps: any = { sx: {} }
    if (props.columnDef.wrap) returnProps.sx.whiteSpace = 'pre-line'
    if (backgroundColor) {
        const maxDepth = backgroundColor?.split('.')[1] ? parseInt(backgroundColor.split('.')[1]) : grouping?.length || 0
        const bgColor = backgroundColor ? backgroundColor?.split('.')[0] : 'blue'
        if (!loading) {
            if (row.getIsExpanded() && row.depth === 0) returnProps.sx.backgroundColor = convertColor(`${bgColor}.${maxDepth}`)
            if (row.getIsGrouped() && row.depth > 0) returnProps.sx.backgroundColor = convertColor(`${bgColor}.${maxDepth - row.depth}`)
            if (!row.getIsGrouped()) returnProps.sx.backgroundColor = convertColor(`${bgColor}.${maxDepth - row.depth}`)
        }
    }

    return returnProps
}