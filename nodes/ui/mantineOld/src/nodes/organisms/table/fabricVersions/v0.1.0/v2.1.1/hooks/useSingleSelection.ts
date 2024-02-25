import { useEffect, useState } from "react"
import { TableProps200 } from "../types/TableProps"
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"

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