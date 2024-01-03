import { useEffect, useState } from "react"
import { TableProps200 } from "../types/TableProps"
import { NoodlNode, sendOutput, sendSignal } from "@rk/node-fabrik"
import { RItem } from "@rk/types"

export default function (noodlNode: NoodlNode, singleSelection: TableProps200['selection']['single']) {
    const [selectedRecord, setSelectedRecord] = useState<RItem>()
    useEffect(() => { setSelectedRecord(singleSelection.selectedItem) }, [singleSelection.selectedItem])
    useEffect(() => {
        if (selectedRecord) {
            sendOutput(noodlNode, 'table2SingleSelectedItem', selectedRecord)
            sendSignal(noodlNode, 'table2SingleSelected')
        } else {
            sendOutput(noodlNode, 'table2SingleSelectedItem', null)
            sendSignal(noodlNode, 'table2SingleUnselected')
        }
    }, [selectedRecord])

    return {selectedRecord, setSelectedRecord}
}