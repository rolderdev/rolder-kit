import { useEffect, useState } from "react"
import { TableProps200 } from "../types/TableProps"
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"

export default function (noodlNode: NoodlNode, multiSelection: TableProps200['selection']['multi']) {
    const [selectedRecords, setSelectedRecords] = useState<RItem[] | undefined>()

    useEffect(() => { if (multiSelection.selectedItems) setSelectedRecords(multiSelection.selectedItems) }, [multiSelection.selectedItems])
    useEffect(() => {
        if (selectedRecords) {
            if (selectedRecords.length) sendOutput(noodlNode, 'table2MultiSelectedItems', selectedRecords)
            else if (selectedRecords.length === 0) sendOutput(noodlNode, 'table2MultiSelectedItems', [])
            setTimeout(() => sendSignal(noodlNode, 'table2MultiSelectionChanged'))
        }
    }, [selectedRecords])

    return { selectedRecords: selectedRecords || [], setSelectedRecords }
}