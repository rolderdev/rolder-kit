import { MRT_Row } from "mantine-react-table";
import { action, atom } from "nanostores";
import { sendOutput, sendSignal } from "../../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send";

/* export const selectedItemAtom = atom<RItem | null>(null)
export const selectItemAtom = atom(null, (_get, set, noodlNode: NoodlNode, row?: MRT_Row<RItem>) => {
    set(selectedItemAtom, () => {
        if (row) {
            sendOutput(noodlNode, 'selectedItem', row.original)
            sendSignal(noodlNode, 'singleSelected')
            return row.original
        } else {
            sendOutput(noodlNode, 'selectedItem', null)
            return null
        }
    })
}) */

export const selectedItem = atom<RItem | null>(null)
export const selectItem = action(selectedItem, 'selectItem', (store, noodlNode: NoodlNode, row?: MRT_Row<RItem>) => {
    if (row) {
        store.set(row.original)
        sendOutput(noodlNode, 'selectedItem', row.original)
        sendSignal(noodlNode, 'singleSelected')
    } else {
        store.set(null)
        sendOutput(noodlNode, 'selectedItem', null)
    }
})