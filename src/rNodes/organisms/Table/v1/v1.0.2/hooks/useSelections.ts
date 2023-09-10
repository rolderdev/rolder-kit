import { useSetState, useShallowEffect } from "@mantine/hooks";
import { NodeInstance } from "@noodl/noodl-sdk";
import { MRT_RowSelectionState, MRT_TableInstance } from "mantine-react-table";
import { useState } from "react";
import isObjetEmpty from 'just-is-empty'
import flush from 'just-flush'
import { sendOutput, sendSignal } from "../../../../../../utils/noodl/v0.1.0/send";

export default function useSelections(props: { noodlNode: NodeInstance, items?: Item[] }) {
    const { noodlNode, items } = props

    const [singleSelection, setSingleSelection] = useState('');
    const [multiSelection, setMultiSelection] = useSetState<MRT_RowSelectionState>({});
    const [filtered, setFiltered] = useState(false);
    const [selectionTableInstance, setSelectionTableInstance] = useState<MRT_TableInstance<Item>>();

    // keep only selected and filtered items
    function handleFiltered(filtersEnabled: boolean) {
        setFiltered(filtersEnabled)
        if (selectionTableInstance && items) {
            const filteredIds = selectionTableInstance.getFilteredRowModel().rows.map(r => r.id)
            setMultiSelection(items?.reduce((a, v) => ({ ...a, [v.id]: filteredIds.includes(v.id) && multiSelection[v.id] }), {}))
            if (!filteredIds.includes(singleSelection)) setSingleSelection('')
        }
    }

    // when selecting one by one    
    const [allSelected, setAllSelected] = useState(false);
    const [partialSelected, setPartialSelected] = useState(false);
    function allPartialSelectionHandler(filtered: boolean) {
        if (items) {
            if (!filtered) {
                const selectedCount = items.filter(i => multiSelection[i.id]).length
                setAllSelected(selectedCount === items?.length)
                setPartialSelected(selectedCount > 0 && !(selectedCount === items?.length))
            } else {
                const filteredItems = selectionTableInstance?.getFilteredRowModel().rows
                const selectedCount = filteredItems?.filter(i => multiSelection[i.id]).length || 0
                setAllSelected(selectedCount > 0 && selectedCount === filteredItems?.length)
                if (selectedCount) setPartialSelected(selectedCount > 0 && !(selectedCount === filteredItems?.length))
            }
        }
    }

    // when selecting at header
    function allSelectionHandler(selected: boolean) {
        if (selectionTableInstance)
            setMultiSelection(selectionTableInstance.getFilteredRowModel().rows?.reduce((a, v) => ({ ...a, [v.id]: selected }), {}))
    }

    // run allPartialSelectionHandler on selection change
    // send selection on output
    useShallowEffect(() => {
        if (!isObjetEmpty(flush(multiSelection))) {
            allPartialSelectionHandler(filtered)
            sendOutput({ noodlNode, portName: 'selectedItems', value: items?.filter(i => multiSelection[i.id]) })
        }
    }, [multiSelection, filtered])

    useShallowEffect(() => {
        if (singleSelection) {
            sendOutput({ noodlNode, portName: 'selectedItem', value: items?.find(i => singleSelection === i.id) })
            sendSignal({ noodlNode, portName: 'singleSelected' })
        }
        else sendOutput({ noodlNode, portName: 'selectedItem', value: null })
    }, [singleSelection])

    return {
        multiSelection, setMultiSelection, handleFiltered, allSelected, partialSelected, setSelectionTableInstance, allSelectionHandler,
        singleSelection, setSingleSelection
    }
}