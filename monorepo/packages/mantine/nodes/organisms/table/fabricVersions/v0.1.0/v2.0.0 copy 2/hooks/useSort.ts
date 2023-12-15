import { useState } from "react"
import { DataTableSortStatus } from "../lib"
import { TableProps200 } from "../types/TableProps"
import { sendOutput } from "../../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { columnsCache } from "../funcs/getColumns"
import { useShallowEffect } from "@mantine/hooks"

export default function (noodlNode: NoodlNode, sort: TableProps200['sort']) {
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>()

    useShallowEffect(() => {
        const columns = columnsCache.get()[noodlNode.id]
        if (sort.enabled) {
            const defaultSortColumn = columns.find(i => i.sort?.default)
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