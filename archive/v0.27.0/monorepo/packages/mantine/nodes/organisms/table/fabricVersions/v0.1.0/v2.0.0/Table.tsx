import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { TableCompProps200 } from './types/TableCompProps';
import { DataTable } from './lib';
import { Box } from '@mantine/core';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import getRecords, { filterStates, filterValues, records } from './funcs/getRecords';
import icons from '../../../../../../libs/icons/v0.2.0/icons';
import { useForceUpdate } from '@mantine/hooks';
import useSingleSelection from './hooks/useSingleSelection';
import useMultiSelection from './hooks/useMultiSelection';
import useProps from './hooks/useProps';
import useSort from './hooks/useSort';
import useRowStyles from './hooks/useRowStyles';
import getColumns from './funcs/getColumns';
import { sendOutput, sendSignal } from '../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send';

export default forwardRef(function (props: TableCompProps200, ref) {
    const {
        noodlNode, columnsDef, children, customProps, items, selection, sort, filter, expansion, libProps, dimensions, tableStyles,
        rowStyles, fetching, onRowClick
    } = useProps(props)

    const forceUpdate = useForceUpdate()
    useEffect(() => {
        records.setKey(noodlNode.id, items)
        // ColumnCell repeter render hack
        setTimeout(() => { forceUpdate(); setTimeout(() => forceUpdate()) })
    }, [items])

    // Single selection
    const { selectedRecord, setSelectedRecord } = useSingleSelection(noodlNode, selection.single)
    // Multi selection
    const { selectedRecords, setSelectedRecords } = useMultiSelection(noodlNode, selection.multi)

    // Sort
    const { sortStatus, setSortStatus } = useSort(noodlNode, sort)
    const SortedIcon = icons(sort.sortedIcon || 'IconArrowUp')
    const UnsortedIcon = icons(sort.unsortedIcon || 'IconSelector')

    // Filter    
    function setFilterValue(columnIdx: number, filterValue?: any) {
        if (filter.enabled && filter.type === 'frontend') filterValues.setKey(`${noodlNode.id}.${columnIdx}`, filterValue || '')
    }
    function setFilterState(columnIdx: number, filterValue?: any) {
        filterStates.setKey(`${noodlNode.id}.${columnIdx}`, filterValue ? true : false)
    }
    function resetFilters() {
        filterValues.setKey(noodlNode.id, {})
        filterStates.setKey(noodlNode.id, {})
        forceUpdate()
    }

    // Expansion
    const [expandedRecordIds, setExpandedRecordIds] = useState<string[]>([])
    useEffect(() => {
        sendOutput(noodlNode, 'table2ExpandedItems', items?.filter(i => expandedRecordIds.includes(i.id)))
        sendSignal(noodlNode, 'table2ExpansionChanged')
    }, [expandedRecordIds])
    const expansionRow = Array.isArray(children)
        ? children.filter(i => i.props.noodlNode.model.type.split('.')[1] === 'ExpansionRow')?.[0]
        : children?.props.noodlNode.model.type.split('.')[1] === 'ExpansionRow'
            ? children
            : null

    // Reseters
    useImperativeHandle(ref, () => ({
        table2ResetSingleSelection() { setSelectedRecord(undefined) },
        table2ResetMultiSelection() { setSelectedRecords([]) },
        table2ResetSort() { setSortStatus(undefined) },
        table2ResetFilters() { resetFilters() },
    }), [])

    // Table styles
    const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>()
    const [animation, setAnimation] = useState(false)
    useEffect(() => {
        if (!fetching && !animation && tableStyles.animation)
            setTimeout(() => setAnimation(true), 100)
    }, [fetching])

    // Row styles
    const { classes, cx } = useRowStyles(rowStyles)

    return <Box w={dimensions.width}>
        <DataTable<RItem>
            // Params    
            columns={getColumns(
                noodlNode, columnsDef, sort, filter, children, setFilterValue, setFilterState, forceUpdate,
                rowStyles, expansion, expandedRecordIds, setExpandedRecordIds, onRowClick, customProps
            )}
            // Data
            records={getRecords(noodlNode.id, items, libProps.fetching, sortStatus)}
            onRowClick={
                // Single selection
                selection.single.enabled && onRowClick === 'singleSelection'
                    ? (item) => {
                        if (selectedRecord?.id === item.id && selection.single.unselectable) setSelectedRecord(undefined)
                        else setSelectedRecord(item)
                    }
                    : undefined
            }
            // Multi selection
            selectedRecords={selection.multi.enabled ? selectedRecords : undefined}
            onSelectedRecordsChange={setSelectedRecords}
            // Sort
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            sortIcons={{
                sorted: SortedIcon && <SortedIcon size={14} {...customProps?.sortedIcon} />,
                unsorted: UnsortedIcon && <UnsortedIcon size={14} {...customProps?.unsortedIcon} />,
            }}
            // Expansion
            rowExpansion={
                expansion.enabled && {
                    allowMultiple: expansion.allowMultiple,
                    trigger: onRowClick === 'expansion' ? 'click' : 'never',
                    expanded: { recordIds: expandedRecordIds, onRecordIdsChange: setExpandedRecordIds },
                    content: ({ record }) => {
                        if (expansionRow) expansionRow.props.noodlNode.resultProps.record = record
                        return expansionRow
                    },
                    collapseProps: { transitionDuration: 50, ...customProps?.collapseProps },
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
            sx={expansion.enabled && !rowStyles.rowBorders && { '&&': { 'tbody tr td': { borderTop: 'none' } } }}
            // States
            fetching={fetching}
            {...libProps}
            {...customProps}
        />
    </Box>
})