import { atom } from "jotai";
import { MRT_RowSelectionState, MRT_TableInstance } from "mantine-react-table";
import { sendOutput } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send";

const selectedItemsAtom = atom<MRT_RowSelectionState>({})
export const getSelectedAtom = atom((get) => get(selectedItemsAtom))
export const allSelectedAtom = atom(false)
export const selectionStateAtom = atom<'none' | 'all' | 'partial'>('none')
export const setSelectionStateAtom = atom(null, (get, set, table: MRT_TableInstance<RItem>) => {
    const allCount = table.getFilteredRowModel().rows.length
    const selectedCount = Object.keys(get(selectedItemsAtom)).filter(i => get(selectedItemsAtom)[i]).length
    if (allCount === 0 || selectedCount === 0) { set(selectionStateAtom, () => 'none'); return }
    if (selectedCount > 0 && allCount !== selectedCount) { set(selectionStateAtom, () => 'partial'); return }
    if (allCount === selectedCount) { set(selectionStateAtom, () => 'all'); return }
})
export const selectAllAtom = atom(null, (get, set, noodlNode: NoodlNode, table: MRT_TableInstance<RItem>) => {
    set(selectedItemsAtom, () => {
        let selectedItemsState: MRT_RowSelectionState = {}
        table.getFilteredRowModel().rows.forEach(i => selectedItemsState[i.original.id] = get(selectionStateAtom) !== 'all')
        const items = table.getFilteredRowModel().rows.map(i => i.original)
        sendOutput(noodlNode, 'selectedItems', items?.filter(i => selectedItemsState[i.id]))
        return selectedItemsState
    })
    set(setSelectionStateAtom, table)
})
export const setSelectionAtom = atom(null, (get, set, noodlNode: NoodlNode, table: MRT_TableInstance<RItem>, rowId: string,
    selected: boolean) => {
    set(selectedItemsAtom, (selectedItems) => { return { ...selectedItems, [rowId]: selected } })
    set(setSelectionStateAtom, table)
    const items = table.getFilteredRowModel().rows.map(i => i.original).filter(i => get(selectedItemsAtom)[i.id])
    sendOutput(noodlNode, 'selectedItems', items)
})

export const resetSelectionAtom = atom(null, (_get, set, noodlNode: NoodlNode, table: MRT_TableInstance<RItem>) => {
    set(selectedItemsAtom, () => { return {} })
    sendOutput(noodlNode, 'selectedItems', [])
    set(setSelectionStateAtom, table)
})