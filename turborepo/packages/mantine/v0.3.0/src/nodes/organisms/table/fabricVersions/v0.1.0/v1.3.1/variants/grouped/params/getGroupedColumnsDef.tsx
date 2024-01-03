import getAccessorFn from "../../../params/getAccessorFn"
import { ColumnDef } from "../../../types/Column"
import { TableCompProps } from "../../../types/TableCompProps"
import getFilterFn from "../../../params/getFilterFn"
import Cell from "../cell/Cell"
import insert from "just-insert"
import omit from "just-omit"
import clone from "just-clone"

export default function (columnsDef: ColumnDef[], tableProps: TableCompProps) {
    if (columnsDef) {
        const groupColumn = tableProps.columns.find(i => i.groupScheme)
        const groupScheme = groupColumn?.groupScheme
        if (groupScheme) {
            tableProps.columns = insert(tableProps.columns, groupScheme.map(i => ({
                id: i.groupBy,
                accessor: i.accessor,
                ...omit(groupColumn, ['id', 'accessor'])
            })), 1)
        }

        const resultColumnsDef = tableProps.columns.map(columnDef => {
            if (!columnDef.accessorFn) columnDef.accessorFn = row => getAccessorFn(columnDef, row)
            columnDef.enableColumnFilter = columnDef.enableColumnFilter || false
            if (columnDef.filterVariant) columnDef.filterFn = getFilterFn(columnDef)
            columnDef.enableSorting = columnDef.enableSorting || false
            //@ts-ignore
            columnDef.Cell = ({ renderedCellValue, table, row }) => Cell(tableProps, columnDef, table, row, renderedCellValue)
            return clone(columnDef)
        })

        return resultColumnsDef
    } else return []
}