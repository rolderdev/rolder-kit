import { useEffect, useState } from "react"
import { TableProps200 } from "../types/TableProps"
import { sendOutput, sendSignal } from "../../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"

export default function (noodlNode: NoodlNode, multiSelection: TableProps200['selection']['multi']) {
    // Multi selection
    const [selectedRecords, setSelectedRecords] = useState<RItem[]>([])
    useEffect(() => { if (multiSelection.selectedItems) setSelectedRecords(multiSelection.selectedItems) }, [multiSelection.selectedItems])
    useEffect(() => {
        if (selectedRecords?.length) sendOutput(noodlNode, 'table2MultiSelectedItems', selectedRecords)
        else sendOutput(noodlNode, 'table2MultiSelectedItems', selectedRecords || [])
        sendSignal(noodlNode, 'table2MultiSelectionChanged')
    }, [selectedRecords])

    return { selectedRecords, setSelectedRecords }
}