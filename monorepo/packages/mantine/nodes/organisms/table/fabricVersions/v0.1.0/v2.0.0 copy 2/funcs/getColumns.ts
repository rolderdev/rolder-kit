import { deepMap } from "nanostores";
import { TableProps200 } from "../types/TableProps";
import { filters, setFilter } from "./getRecords";

export const columnsCache = deepMap<{ [noodlNodeId: string]: any[] }>({})

export function getColumns(noodlNode: NoodlNode, sort: TableProps200['sort'], children: any, setFilterValue: any) {
    const columnFilters = Array.isArray(children)
        ? children.filter(i => i.props.noodlNode.model.type.split('.')[1] === 'ColumnFilter')
        : children?.props.noodlNode.model.type.split('.')[1] === 'ColumnFilter'
            ? [children]
            : null

    const columns = columnsCache.get()[noodlNode.id].map((column, columnIdx) => {
        // Sort
        if (!sort.enabled) {
            delete column.sortable
            delete column.sort
        } else {
            if (sort.type === 'backend') delete column.sort?.func
            if (column.sort) column.sortable = true
        }

        // Filters
        const columnFilter = columnFilters?.find(i => i.props.noodlNode.props.table2ColumnIndex === columnIdx)
        if (columnFilter) {
            setFilter({ noodlNode, columnIdx, filter: { func: column.filterFunc, value: undefined } })
            console.log(filters.get()[noodlNode.id])
            columnFilter.props.noodlNode.resultProps.setFilterValue = setFilterValue
            column.filter = ({ close }: { close: () => void }) => {
                columnFilter.props.noodlNode.resultProps.close = close
                return columnFilter
            }
        }
        return column
    })

    columnsCache.setKey(noodlNode.id, columns)
    return columnsCache.get()[noodlNode.id]
}