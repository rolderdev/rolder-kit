import { atom } from "jotai";
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send";
import { MRT_Row } from "mantine-react-table";

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