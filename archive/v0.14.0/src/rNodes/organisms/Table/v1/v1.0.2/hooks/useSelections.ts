import { useSetState, useShallowEffect } from "@mantine/hooks";
import { MRT_RowSelectionState, MRT_TableInstance } from "mantine-react-table";
import { useState } from "react";
import isObjetEmpty from 'just-is-empty'
import flush from 'just-flush'
import { NodeInstance } from "../../../../../../main/getNodes/v0.5.0/types";
import { sendOutput, sendSignal } from "../../../../../../main/ports/send/v0.3.0/send";

export default function useSelections(props: { node: NodeInstance, items?: NItem[] }) {
    const { node, items } = props

    const [singleSelection, setSingleSelection] = useState('');
    const [multiSelection, setMultiSelection] = useSetState<MRT_RowSelectionState>({});
    const [filtered, setFiltered] = useState(false);
    const [selectionTableInstance, setSelectionTableInstance] = useState<MRT_TableInstance<NItem>>();

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
            sendOutput(node, 'selectedItems', items?.filter(i => multiSelection[i.id]))
        }
    }, [multiSelection, filtered])

    useShallowEffect(() => {
        if (singleSelection) {
            sendOutput(node, 'selectedItem', items?.find(i => singleSelection === i.id))
            sendSignal(node, 'singleSelected')
        }
        else sendOutput(node, 'selectedItem', null)
    }, [singleSelection])

    return {
        multiSelection, setMultiSelection, handleFiltered, allSelected, partialSelected, setSelectionTableInstance, allSelectionHandler,
        singleSelection, setSingleSelection
    }
}