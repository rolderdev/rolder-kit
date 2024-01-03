import { useState } from "react"
import { DataTableSortStatus } from "../lib"
import { NoodlNode, sendOutput } from "@rk/node-fabrik"
import { useShallowEffect } from "@mantine/hooks"
import { TableProps200 } from "../types/TableProps"
import { columnsCache } from "../funcs/getColumns"
import { ColumnDef200 } from "../types/Column"

export default function (noodlNode: NoodlNode, sort: TableProps200['sort']) {
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>()

    useShallowEffect(() => {
        if (sort.enabled) {
            const columns = columnsCache.get()[noodlNode.id] as ColumnDef200[]
            const defaultSortColumn = columns?.find(i => i.sort?.default)
            if (!sortStatus && defaultSortColumn && defaultSortColumn.sort) setSortStatus({
                columnAccessor: defaultSortColumn.accessor,
                direction: defaultSortColumn.sort.default
            })
        }
        if (sortStatus) {
            sendOutput(noodlNode, 'table2SortValue', [{ [sortStatus.columnAccessor]: sortStatus.direction }])
        } else sendOutput(noodlNode, 'table2SortValue', null)
    }, [sortStatus])

    return { sortStatus, setSortStatus }
}