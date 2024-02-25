import { NoodlNode } from "@shared/node"
import { useEffect, useState } from "react"
import { TableProps } from "../../types"
import { Item } from "@shared/types"
import { sendOutput, sendSignal } from '@shared/port-send'

export default function (noodlNode: NoodlNode, singleSelection: TableProps['selection']['single']) {
    const [selectedRecord, setSelectedRecord] = useState<Item>()

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

    return { selectedRecord, setSelectedRecord }
}