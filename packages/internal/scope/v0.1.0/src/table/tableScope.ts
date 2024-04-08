import type { Item } from "types";
import { createScope, molecule } from "bunshi";
import { useMolecule } from "bunshi/react";
import { deepMap } from "nanostores";

export const TableScope = createScope<unknown>(undefined);
export const TableMolecule = molecule((_, scope) => {
    scope(TableScope)
    return deepMap<{
        [columnIdx: string]: {
            func?(items: Item[], filterValue: any): Item[],
            value?: any,
            state?: boolean
        }
    }>({})
})

export function useTableScope(tableId: string) {
    const tableMol = useMolecule(TableMolecule, { withScope: [TableScope, tableId] })
    const filters = tableMol.get()
    const getColumnFilter = (columnIdx: number) => tableMol.get()[columnIdx]
    const setFilterValue = (columnIdx: number, value: any) => tableMol.setKey(`${columnIdx}.value`, value)
    const setFilterState = (columnIdx: number, state: boolean) => tableMol.setKey(`${columnIdx}.state`, state)
    const setFilterFunc = (columnIdx: number, func: any) => tableMol.setKey(`${columnIdx}.func`, func)
    const resetFilterValue = (columnIdx: number) => tableMol.setKey(`${columnIdx}.value`, undefined)
    const resetFilters = () => {
        tableMol.set({})
        Noodl.Events.emit(`resetTableFilters-${tableId}`)
    }
    const runFilterFunc = (columnIdx: number, items: Item[], value: any) => filters[columnIdx]?.func?.(items, value)

    return {
        filters, runFilterFunc, getColumnFilter, setFilterValue, setFilterState, setFilterFunc, resetFilterValue, resetFilters
    }
}