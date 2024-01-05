import getAccessorFn from "../../../params/getAccessorFn"
import { ColumnDef } from "../../../types/Column"
import { TableCompProps } from "../../../types/TableCompProps"
import getFilterFn from "../../../params/getFilterFn"
import Cell from "../cell/Cell"
import Header from "../header/Header"

export default function (columnsDef: ColumnDef[], tableProps: TableCompProps) {
    if (columnsDef) {
        const { clone } = window.R.libs.just

        const resultColumnsDef = tableProps.columns.map(columnDef => {
            columnDef.accessorFn = row => getAccessorFn(columnDef, row)
            columnDef.enableColumnFilter = columnDef.enableColumnFilter || false
            if (columnDef.filterVariant) columnDef.filterFn = getFilterFn(columnDef)
            columnDef.enableSorting = columnDef.enableSorting || false
            columnDef.Header = ({ table }) => Header(tableProps, columnDef, table)
            columnDef.Cell = ({ renderedCellValue, table, row }) => Cell(tableProps, columnDef, table, row, renderedCellValue)
            return clone(columnDef)
        })

        return resultColumnsDef
    } else return []
}