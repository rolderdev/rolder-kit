import { useMantineReactTable } from "mantine-react-table";
import useColumns from "./params/useColumns";
import { TableCompProps } from "./types/TableCompProps";
import { useShallowEffect } from "@mantine/hooks";
import useSelections from "./hooks/useSelections";
import useBaseParams from "./params/useBaseParams";
import getGroupedParams from "./params/getGroupedParams";

export default function getTabelInctance(tableProps: TableCompProps) {
    const { grouped, columns } = tableProps
    const hasGroupScheme = columns.some(i => i.groupScheme)

    const selectionProps = useSelections(tableProps)
    let resultColumns = useColumns({ tableProps, selectionProps })
    let tableParams = useBaseParams({ resultColumns, tableProps, selectionProps })
    tableParams = grouped && hasGroupScheme ? getGroupedParams({ tableParams, tableProps, selectionProps }) : tableParams

    const table = useMantineReactTable<NItem>(tableParams)

    // pass instance to filter selection later
    useShallowEffect(() => selectionProps.setSelectionTableInstance(table), [table])

    // on filters change
    useShallowEffect(() => {
        // autoexpand 
        let filtersEnabled = false
        const filters = table?.getState().columnFilters
        if (filters.length) filters.forEach(filter => {
            if (Array.isArray(filter.value)) filter.value.forEach(v => { if (v) filtersEnabled = true })
            else if (filter.value) filtersEnabled = true
        })
        if (filtersEnabled) table.toggleAllRowsExpanded(true)
        else table.toggleAllRowsExpanded(false)
        // change selections on new filters
        selectionProps.handleFiltered(filtersEnabled)
    }, [table?.getState().columnFilters])

    return { table, selectionProps }
}