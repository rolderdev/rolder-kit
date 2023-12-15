import { action, deepMap } from "nanostores";
import { DataTableSortStatus } from "../lib";
import { columnsCache } from "./getColumns";
import { TableProps200 } from "../types/TableProps";
import { ColumnDef200 } from "../types/Column";

type Filter = {
    func?: ColumnDef200['filterFunc'],
    value?: any
}
type SetFilter = {
    noodlNode: NoodlNode
    columnIdx: number
    filter: Filter
}

export const originalRecords = deepMap<{ [noodlNodeId: string]: RItem[] }>({})
export const recordsCache = deepMap<{ [noodlNodeId: string]: RItem[] }>({})
export const filters = deepMap<{ [noodleNodeId: string]: { [idx: string]: Filter } }>({})

export const setFilter = action(filters, 'setFilter', (store, props: SetFilter) => {
    const { noodlNode, columnIdx, filter } = props
    store.setKey(`${noodlNode.id}.${columnIdx}`, filter)
})

export function getRecords(
    noodlNodeId: string, sort: TableProps200['sort'], sortStatus?: DataTableSortStatus, fetching?: boolean
) {
    // Front filter
    let filteredRecords = originalRecords.get()[noodlNodeId]
    const f = filters.get()[noodlNodeId]
    console.log(f)
    if (f) {
        Object.values(f).forEach(filter => {
            const fv = filter.value
            const isNotEmpty = Array.isArray(fv) ? fv?.length : fv
            if (filter.func && isNotEmpty) filteredRecords = filter.func(filteredRecords, fv)
        })
        recordsCache.setKey(noodlNodeId, filteredRecords)
    }

    // Front sort    
    if (sort.type === 'frontend') {
        if (sortStatus?.direction && !fetching) {
            const sortFunc = columnsCache.get()[noodlNodeId].find(i => i.accessor === sortStatus?.columnAccessor)?.sort?.func
            if (sortFunc) recordsCache.setKey(noodlNodeId, sortFunc(filteredRecords, sortStatus.direction))
        }
    } else recordsCache.setKey(noodlNodeId, filteredRecords)

    return filteredRecords
}