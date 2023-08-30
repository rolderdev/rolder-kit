import { MRT_VisibilityState } from "mantine-react-table"
import { getValue } from '../../../../../../utils/data/v0.3.0/data';
import insert from 'just-insert';
import { Column } from "../types/Column";

export default function getGroupedParams(tableParams: any, grouped: boolean) {
    let columns: Column[] = tableParams.columns
    let grouping = undefined

    //// grouping    
    //grouped = columns.some(i => i.groupShceme)
    const groupColumn = columns.find(i => i.groupShceme)
    const groupShceme = groupColumn?.groupShceme
    if (grouped && groupShceme) {
        grouping = groupShceme.map(i => i.groupBy)
        // add groupped columns
        columns = insert(columns, groupShceme.map(i => ({
            id: i.groupBy,
            accessorFn: (row: Item) => getValue(row, i.accessor),
            header: groupColumn.header,
            size: groupColumn.size
        })), 1)
        // hide grouped columns      
        let colVis: MRT_VisibilityState = { [groupColumn.header]: false }
        groupShceme.forEach(i => { colVis[i.groupBy] = false })
        tableParams.columns = columns
        tableParams.state.columnVisibility = colVis
        tableParams.state.grouping = grouping
        tableParams.enableGrouping = grouped
    }

    return tableParams
}