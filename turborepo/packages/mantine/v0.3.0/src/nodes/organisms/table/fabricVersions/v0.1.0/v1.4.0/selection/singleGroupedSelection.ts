import { MRT_Row } from "mantine-react-table";
import { NoodlNode, sendOutput, sendSignal } from "@rk/node-fabrik";
import { atom } from "jotai";
import { RItem } from "@rk/types";
import filter from "just-filter-object";
import get from 'just-safe-get'

export const selectedGroupedItemAtom = atom<RItem | null>(null)
export const selectGroupedItemAtom = atom(null, (_get, set, noodlNode: NoodlNode, row?: MRT_Row<RItem>, valueAccessor?: string[]) => {
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