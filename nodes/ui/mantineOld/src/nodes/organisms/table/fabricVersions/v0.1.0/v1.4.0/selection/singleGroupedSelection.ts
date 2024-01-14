import { MRT_Row } from "mantine-react-table";
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send";
import { atom } from "jotai";

export const selectedGroupedItemAtom = atom<RItem | null>(null)
export const selectGroupedItemAtom = atom(null, (_get, set, noodlNode: NoodlNode, row?: MRT_Row<RItem>, valueAccessor?: string[]) => {
    const { get, filter } = window.R.libs.just
    set(selectedGroupedItemAtom, () => {
        if (row && valueAccessor) {
            let resultItem: any = {}
            filter(row.original, (_, v) => { if (get(v, valueAccessor) === row.groupingValue) resultItem = v })
            if (resultItem.id) {
                sendOutput(noodlNode, 'selectedGroupedItem', resultItem)
                sendSignal(noodlNode, 'groupedRowSelected')
                return resultItem
            } else {
                sendOutput(noodlNode, 'selectedGroupedItem', null)
                return null
            }
        } else {
            sendOutput(noodlNode, 'selectedGroupedItem', null)
            return null
        }
    })
})