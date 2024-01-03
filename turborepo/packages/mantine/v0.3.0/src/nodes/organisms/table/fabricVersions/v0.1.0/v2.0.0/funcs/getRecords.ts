import { deepMap } from "nanostores";
import { DataTableSortStatus } from "../lib";
import { ColumnDef200 } from "../types/Column";
import { columnsCache } from "./getColumns";
import { RItem } from "@rk/types";

export const records = deepMap<{ [noodleNodeId: string]: RItem[] }>({})
export const filterFuncs = deepMap<{ [noodleNodeId: string]: { [idx: string]: ColumnDef200['filterFunc'] } }>({})
export const filterValues = deepMap<{ [noodleNodeId: string]: { [idx: string]: any } }>({})
export const filterStates = deepMap<{ [noodleNodeId: string]: { [idx: string]: boolean } }>({})

export default (
    noodlNodeId: string, items: RItem[], fetching?: boolean, sortStatus?: DataTableSortStatus
): RItem[] => {
    const columns = columnsCache.get()[noodlNodeId] as ColumnDef200[]
    let resultRecords = [...items || []]

    // Front filter
    columns?.forEach((_, columnsIdx) => {
        const filterFunc = filterFuncs.get()[noodlNodeId]?.[columnsIdx]
        const filterValue = filterValues.get()[noodlNodeId]?.[columnsIdx]
        if (filterFunc && filterValue) resultRecords = filterFunc(resultRecords, filterValue)
    })

    // Front sort    
    if (sortStatus?.direction && !fetching) {
        const sortFunc = columns.find(i => i.accessor === sortStatus?.columnAccessor)?.sort?.func
        if (sortFunc) resultRecords = sortFunc(resultRecords, sortStatus.direction)
    }

    records.setKey(noodlNodeId, resultRecords)
    return resultRecords
}