import { forwardRef, useEffect, useImperativeHandle, useReducer, useState } from 'react';
import { TableCompProps200 } from './types/TableCompProps';
import { DataTable } from './lib';
import { Box } from '@mantine/core';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import getRecords, { filterValues, records } from './funcs/getRecords';
import icons from '../../../../../../libs/icons/v0.2.0/icons';
import { useForceUpdate } from '@mantine/hooks';
import useSingleSelection from './hooks/useSingleSelection';
import useMultiSelection from './hooks/useMultiSelection';
import useProps from './hooks/useProps';
import useSort from './hooks/useSort';
import useRowStyles from './hooks/useRowStyles';
import getColumns from './funcs/getColumns';
import { action, atom } from 'nanostores';

export default forwardRef(function (props: TableCompProps200, ref) {
    const {
        noodlNode, columnsDef, children, customProps, items, selection, sort, libProps, dimensions, tableStyles, rowStyles, fetching,
        allowMultiple
    } = useProps(props)

    useEffect(() => {
        //if (!columnCells?.length) setCellsReady(true)
        //forceUpdate()
    }, [children])
    //useEffect(() => setColumns(noodlNode, columnsDef, sort, children, setFilterValue, columnCells), [columnsDef, sort])
    useEffect(() => records.setKey(noodlNode.id, items), [items])

    // Single selection
    const { selectedRecord, setSelectedRecord } = useSingleSelection(noodlNode, selection.single)
    // Multi selection
    const { selectedRecords, setSelectedRecords } = useMultiSelection(noodlNode, selection.multi)

    // Sort
    const { sortStatus, setSortStatus } = useSort(noodlNode, sort)
    const SortedIcon = icons(sort.sortedIcon || 'IconArrowUp')
    const UnsortedIcon = icons(sort.unsortedIcon || 'IconSelector')

    // Filter
    const forceUpdate = useForceUpdate()
    function setFilterValue(columnIdx: number, filterValue?: any) {
        filterValues.setKey(`${noodlNode.id}.${columnIdx}`, filterValue || '')
        forceUpdate()
    }

    // Reseters
    useImperativeHandle(ref, () => ({
        table2ResetSingleSelection() { setSelectedRecord(undefined) },
        table2ResetMultiSelection() { setSelectedRecords([]) },
        table2ResetSort() { setSortStatus(undefined) },
        reset() { forceUpdate() }
    }), [])

    /* const [expandedRecordIds, setExpandedRecordIds] = useState<string[]>([])
    useEffect(() => {
        sendOutput(noodlNode, 'table2ExpandedItems', items?.filter(i => expandedRecordIds.includes(i.id)))
        sendSignal(noodlNode, 'table2ExpansionChanged')
    }, [expandedRecordIds]) */

    /* const tableRow = Array.isArray(props.children)
        ? props.children.filter(i => i.props.noodlNode.model.type.split('.')[1] === 'TableRow')?.[0]
        : props.children?.props.noodlNode.model.type.split('.')[1] === 'TableRow'
            ? props.children
            : null */

    // Table styles
    const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>()
    const [animation, setAnimation] = useState(false)
    useEffect(() => {
        if (!fetching && !animation && tableStyles.animation)
            setTimeout(() => setAnimation(true), 100)
    }, [fetching])

    // Row styles
    const { classes, cx } = useRowStyles(rowStyles)

    console.log('render')

    useEffect(() => { setTimeout(() => forceUpdate(), 100) }, [items])

    const rowItem = Array.isArray(children)
        ? children.filter(i => i.props.noodlNode.model.type.split('.')[1] === 'RowItem')?.[0]
        : children?.props.noodlNode.model.type.split('.')[1] === 'RowItem'
            ? children
            : null



    return <Box w={dimensions.width}>
        {rowItem}
        <DataTable<RItem>
            // Params    
            columns={getColumns(noodlNode, columnsDef, sort, children, setFilterValue)}
            // Data
            records={getRecords(noodlNode.id, items, libProps.fetching, sortStatus)}
            /* onRowClick={
                // Single selection
                selection.single.enabled && props.table2OnRowClick === 'singleSelection'
                    ? (item) => {
                        if (selectedRecord?.id === item.id && selection.single.unselectable) setSelectedRecord(undefined)
                        else setSelectedRecord(item)
                    }
                    : undefined
            } */
            // Multi selection
            //selectedRecords={selection.multi.enabled ? selectedRecords : undefined}
            //onSelectedRecordsChange={setSelectedRecords}
            // Sort
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            sortIcons={{
                sorted: SortedIcon && <SortedIcon size={14} {...customProps?.sortedIcon} />,
                unsorted: UnsortedIcon && <UnsortedIcon size={14} {...customProps?.unsortedIcon} />,
            }}
            // Table styles
            bodyRef={tableStyles.animation ? bodyRef : undefined}
            // Row styles
            rowClassName={({ id }) => (cx(
                { [classes.row]: rowStyles.enabled },
                { [classes.striped]: rowStyles.enabled && rowStyles.striped },
                { [classes.multiSelected]: rowStyles.enabled && selection.multi.enabled && selectedRecords?.map(i => i.id).includes(id) },
                { [classes.singleSelected]: rowStyles.enabled && selection.single.enabled && selectedRecord?.id === id },
            ))}
            // States
            fetching={fetching}
            // Expansion
            /* rowExpansion={{
                allowMultiple: allowMultiple,
                expanded: { recordIds: expandedRecordIds, onRecordIdsChange: setExpandedRecordIds },
                content: () => tableRow ? tableRow : null,
            }} */
            {...libProps}
            {...customProps}
        />
    </Box>
})