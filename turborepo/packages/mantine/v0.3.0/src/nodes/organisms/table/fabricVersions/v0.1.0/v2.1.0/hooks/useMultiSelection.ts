import { useEffect, useState } from "react"
import { TableProps200 } from "../types/TableProps"
import { NoodlNode, sendOutput, sendSignal } from "@rk/node-fabrik"
import { RItem } from "@rk/types"

export default function (noodlNode: NoodlNode, multiSelection: TableProps200['selection']['multi']) {
    const [selectedRecords, setSelectedRecords] = useState<RItem[]>([])
    useEffect(() => { if (multiSelection.selectedItems) setSelectedRecords(multiSelection.selectedItems) }, [multiSelection.selectedItems])
    useEffect(() => {
        if (selectedRecords?.length) sendOutput(noodlNode, 'table2MultiSelectedItems', selectedRecords)
        else sendOutput(noodlNode, 'table2MultiSelectedItems', selectedRecords || [])
        sendSignal(noodlNode, 'table2MultiSelectionChanged')
    }, [selectedRecords])

    return { selectedRecords, setSelectedRecords }
}