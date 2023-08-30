import { MantineColor, Sx } from "@mantine/core"
import { MRT_Row, MRT_TableOptions } from "mantine-react-table"
import { convertColor } from "../../../../../../utils/converters/v0.1.0/converters"
import { Column } from "../types/Column"

export default function mantineTableBodyCellProps(props: {
    row: MRT_Row<Item>, backgroundColor: MantineColor, loading: boolean, groupColumnDef: Column | undefined
}): MRT_TableOptions['mantineTableBodyCellProps'] {
    const { row, backgroundColor, loading, groupColumnDef } = props
    const grouping = groupColumnDef?.groupShceme?.map(i => i.groupBy)

    if (backgroundColor) {
        let sx: Sx = { backgroundColor: 'white' }
        const maxDepth = backgroundColor?.split('.')[1] ? parseInt(backgroundColor.split('.')[1]) : grouping?.length || 0
        const bgColor = backgroundColor ? backgroundColor?.split('.')[0] : 'blue'
        if (!loading) {
            if (row.getIsExpanded() && row.depth === 0) sx.backgroundColor = convertColor(`${bgColor}.${maxDepth}`)
            if (row.getIsGrouped() && row.depth > 0) sx.backgroundColor = convertColor(`${bgColor}.${maxDepth - row.depth}`)
            if (!row.getIsGrouped()) sx.backgroundColor = convertColor(`${bgColor}.${maxDepth - row.depth}`)
        }
        return { sx }
    }
}