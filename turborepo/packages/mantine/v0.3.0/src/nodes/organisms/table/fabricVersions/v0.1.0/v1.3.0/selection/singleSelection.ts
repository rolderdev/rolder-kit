import { MRT_Row } from "mantine-react-table";
import { NoodlNode, sendOutput, sendSignal } from "@rk/node-fabrik";
import { atom } from "jotai";
import { RItem } from "@rk/types";

export const selectedItemAtom = atom<RItem | null>(null)
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
})