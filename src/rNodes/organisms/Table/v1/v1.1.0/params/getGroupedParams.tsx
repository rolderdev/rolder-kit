import { MRT_VisibilityState } from "mantine-react-table"
import { Column } from "../types/Column"
import GroupCell from "../cells/GroupCell"
import { TableCompProps } from "../types/TableCompProps"
import { Selection } from "../types/Selection"
import GroupHeader from "../headers/GroupHeader"

export default function getGroupedParams(props: { tableParams: any, tableProps: TableCompProps, selectionProps: Selection }) {
    const { tableParams, tableProps, selectionProps } = props
    const groupColumn: Column = tableParams.columns.find((i: Column) => i.groupScheme)
    const groupScheme: Column['groupScheme'] = groupColumn?.groupScheme

    if (groupScheme) {
        let colVis: MRT_VisibilityState = { [groupColumn.header]: false }
        groupScheme.forEach(i => { colVis[i.groupBy] = false })
        tableParams.state.columnVisibility = colVis
        tableParams.state.grouping = groupScheme.map(i => i.groupBy)
        tableParams.enableGrouping = true
        tableParams.displayColumnDefOptions = {
            'mrt-row-expand': {
                Header: ({ table }: any) => <GroupHeader
                    tableProps={tableProps} selectionProps={selectionProps} columnDef={groupColumn} table={table}
                />,
                Cell: ({ row, cell }: any) => <GroupCell
                    tableProps={tableProps} selectionProps={selectionProps} columnDef={groupColumn} row={row} cell={cell}
                />,
            },
        }

        return tableParams
    }
}