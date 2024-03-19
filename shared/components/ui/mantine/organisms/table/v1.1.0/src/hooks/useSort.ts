import { useState } from "react"
import { DataTableSortStatus } from "../lib"
import { useShallowEffect } from "@mantine/hooks"
import { NoodlNode } from "@shared/node"
import { ColumnDef, TableProps } from "../../types"
import { sendOutput } from "@shared/port-send"

export default function (noodlNode: NoodlNode, sort: TableProps['sort'], columns: ColumnDef[],) {
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>()

    useShallowEffect(() => {
        if (sort.enabled) {
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