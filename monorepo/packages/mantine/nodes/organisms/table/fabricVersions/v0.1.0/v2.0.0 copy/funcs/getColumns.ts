import { filters, setFilter } from "../Table"
import { DataTableColumn } from "../lib"
import { ColumnDef200 } from "../types/Column"
import { TableCompProps200 } from "../types/TableCompProps"

export default (props: TableCompProps200, Filter: any): DataTableColumn<RItem>[] => {
    const { noodlNode, table2Sort, table2Columns, table2SortType } = props

    const columnFilters = Array.isArray(props.children)
        ? props.children.filter(i => i.props.noodlNode.model.type.split('.')[1] === 'ColumnFilter')
        : props.children?.props.noodlNode.model.type.split('.')[1] === 'ColumnFilter'
            ? [props.children]
            : null

    return table2Columns.map((i: ColumnDef200, columnIdx) => {
        // Sort
        if (!table2Sort) {
            delete i.sortable
            delete i.sort
        } else {
            if (table2SortType === 'backend') delete i.sort?.func
            if (i.sort) i.sortable = true
        }

        // Filters
        const columnFilter = columnFilters?.find(i => i.props.noodlNode.props.table2ColumnIndex === columnIdx)
        if (columnFilter) {            
            setFilter({noodlNode, columnIdx, filter: {func: i.filterFunc, value: undefined}})
            columnFilter.props.noodlNode.resultProps.Filter = Filter
            i.filter = ({ close }) => {
                columnFilter.props.noodlNode.resultProps.close = close
                return columnFilter
            }
        }
        return i
    })
}