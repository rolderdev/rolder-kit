import { MRT_Row } from "mantine-react-table";
import { action, atom } from "nanostores";
import { NoodlNode, sendOutput, sendSignal } from "@rk/node-fabrik";
import { RItem } from "@rk/types";

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