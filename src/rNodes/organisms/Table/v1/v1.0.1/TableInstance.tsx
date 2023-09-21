import { MRT_RowSelectionState, useMantineReactTable } from "mantine-react-table";
import prepColumns from "./params/prepColumns";
import getGroupedParams from "./params/getGroupedParams";
import { TableCompProps } from "./types/TableCompProps";
import { useShallowEffect } from "@mantine/hooks";
import { useState } from "react";
import { BaseHeader, Cell } from "./comps/Cell";
import getBaseParams from "./params/getBaseParams";
import displayColumnDefOptions from "./mantineProps/displayColumnDefOptions";
import mantineTableBodyRowProps from "./mantineProps/mantineTableBodyRowProps";
import mantineTableProps from "./mantineProps/mantineTableProps";
import mantineLoadingOverlayProps from "./mantineProps/mantineLoadingOverlay";
import { MultiSelectionHeader } from "./comps/MultiSelectionHeader";
import { MultiSelectionRow } from "./comps/MultiSelectionRow";
import useSelections from "./hooks/useSelections";
import mantineTableBodyCellProps from "./mantineProps/mantineTableBodyCellProps";

export default function getTabelInctance(props: TableCompProps) {
    const { columns, items, grouped, multiSelect, node } = props

    // multiSelection hook
    const {
        multiSelection, setMultiSelection, handleFiltered, setSelectionTableInstance, allSelectionHandler, allSelected, partialSelected
    } = useSelections({ node, items })

    // single selection 
    const [singleRowSelection, setSingleRowSelection] = useState<MRT_RowSelectionState>({});

    // base params    
    let resultColumns = prepColumns(columns)
    let tableParams = getBaseParams({ resultColumns, ...props })
    const groupColumnDef = columns.find(i => i.groupShceme)
    // apply props    
    tableParams.mantineTableProps = mantineTableProps(props)
    tableParams.mantineLoadingOverlayProps = mantineLoadingOverlayProps(props)
    tableParams.mantineTableBodyRowProps = ({ row }: any) =>
        mantineTableBodyRowProps({ row, setSingleRowSelection, singleRowSelection, ...props })
    tableParams.mantineTableBodyCellProps = ({ row }: any) =>
        mantineTableBodyCellProps({ row, groupColumnDef, ...props })

    // not grouped variant
    // multi selections    
    if (multiSelect && !groupColumnDef && !grouped) {
        const headerProps = { allSelected, partialSelected, allSelectionHandler, ...props }
        tableParams.columns[0].Header = ({ column }: any) => <MultiSelectionHeader column={column} {...headerProps} />
        const rowProps = { multiSelection, setMultiSelection, ...props }
        tableParams.columns[0].Cell = ({ row, cell }: any) => <MultiSelectionRow row={row} cell={cell} {...rowProps} />
    } else {
        tableParams.columns[0].Header = ({ column }: any) => BaseHeader({ column, ...props })
        tableParams.columns[0].Cell = ({ cell, row }: any) => Cell({ cell, row, ...props })
    }

    // grouped variant        
    if (groupColumnDef && grouped) {
        tableParams = getGroupedParams(tableParams, grouped)
        tableParams.displayColumnDefOptions =
            displayColumnDefOptions({ groupColumnDef, multiSelection, setMultiSelection, allSelectionHandler, allSelected, partialSelected, ...props })
    }

    //////////////////////////////// table init
    const table = useMantineReactTable<Item>(tableParams)

    // pass instance to filter selection later
    useShallowEffect(() => setSelectionTableInstance(table), [table])

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
        handleFiltered(filtersEnabled)
    }, [table?.getState().columnFilters])

    return table
}