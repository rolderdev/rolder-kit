import { cloneElement, forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Box } from '@mantine/core';
import { Props } from './types';
import { DataTable } from './src/lib';
import { getCompProps } from "@shared/get-comp-props"
import useProps from './src/hooks/useProps';
import { Item } from '@shared/types';
import React from 'react';
import useSingleSelection from './src/hooks/useSingleSelection';
import useMultiSelection from './src/hooks/useMultiSelection';
import useRowStyles from './src/hooks/useRowStyles';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { sendOutput, sendSignal } from '@shared/port-send';
import { Expander } from './src/components/expander';
import useSort from './src/hooks/useSort';
import getRecords from './src/funcs/getRecords';
import { ScopeProvider } from "bunshi/react";
import { useForceUpdate } from '@mantine/hooks';
import { TableScope, useTableScope } from "@shared/scope";

export default forwardRef(function (props: Props, ref) {
    const { noodlNode, customProps, children } = props
    const p = { ...getCompProps(props) } as Props

    const {
        libProps, columnsDef, items, onRowClick,
        dimensions, tableStyles, rowStyles,
        sort, filter, selection, expansion, fetching
    } = useProps(p)

    const forceUpdate = useForceUpdate()
    // ColumnCell repeater render hack
    useEffect(() => {
        setTimeout(() => forceUpdate())
    }, [items])

    // Single selection
    const { selectedRecord, setSelectedRecord } = useSingleSelection(noodlNode, selection.single)
    // Multi selection
    const { selectedRecords, setSelectedRecords } = useMultiSelection(noodlNode, selection.multi)

    // Filter   
    const tableId = props.noodlNode.id
    const { filters, getColumnFilter, resetFilters, setFilterFunc, runFilterFunc } = useTableScope(tableId)

    // Expansion
    const [expandedRecordIds, setExpandedRecordIds] = useState<string[]>([])
    useEffect(() => {
        sendOutput(noodlNode, 'table2ExpandedItems', items?.filter(i => expandedRecordIds.includes(i.id)))
        sendSignal(noodlNode, 'table2ExpansionChanged')
    }, [expandedRecordIds])
    const expansionRow = useMemo(() => {
        const ch: any = children
        return Array.isArray(ch)
            ? ch.filter(i => i.props.noodlNode.model?.type.split('.')[1] === 'ExpansionRow')?.[0]
            : ch?.props.noodlNode.model?.type.split('.')[1] === 'ExpansionRow'
                ? ch
                : null
    }, [])

    // Columns
    const columns = useMemo(() => {
        const ch: any = children
        // ColumnCell
        const columnCells = Array.isArray(ch)
            ? ch.filter(i => i.props.noodlNode.model?.type.split('.')[1] === 'ColumnCell')
            : ch?.props.noodlNode.model?.type.split('.')[1] === 'ColumnCell'
                ? [ch]
                : []

        // ColumnFilter
        const columnFilters = Array.isArray(ch)
            ? ch.filter(i => i.props.noodlNode.model?.type.split('.')[1] === 'ColumnFilter')
            : ch?.props.noodlNode.model?.type.split('.')[1] === 'ColumnFilter'
                ? [ch]
                : null

        return columnsDef.map((column, columnIdx) => {
            if (!column.accessor) column.accessor = `${columnIdx}`

            const columnCell = columnCells?.find(i => i.props.noodlNode.props.table2ColumnIndex === columnIdx)

            // Sort
            if (!sort.enabled) {
                delete column.sortable
                delete column.sort
            } else {
                if (sort.type === 'backend') delete column.sort?.func
                if (column.sort) column.sortable = true
            }

            // Filter
            if (!filter.enabled) {
                delete column.filter
                delete column.filterFunc
                delete column.filtering
            } else {
                if (filter.type === 'backend') delete column.filterFunc

                const columnFilter = columnFilters?.find(i => i.props.noodlNode.props.table2ColumnIndex === columnIdx)
                if (columnFilter) {
                    columnFilter.props.noodlNode.props.innerProps = { tableId }
                    if (filter.type === 'frontend') setFilterFunc(columnIdx, column.filterFunc)

                    columnFilter.props.noodlNode.props.innerProps.forceUpdate = forceUpdate
                    column.filter = ({ close }: { close: () => void }) => {
                        columnFilter.props.noodlNode.props.innerProps.close = close
                        return columnFilter
                    }
                    column.filtering = getColumnFilter(columnIdx)?.state
                }
            }

            column.render = (record) => {
                const value = column.getValue ? column.getValue(record) : window.R.utils.getValue.v8(record, column.accessor)

                const boxProps = typeof column.boxProps === 'function'
                    ? column.boxProps(record)
                    : column.boxProps

                if (columnCell) {
                    columnCell.props.noodlNode.props.record = record
                    return expansion.enabled && column.expander
                        ? <Box {...boxProps}>{
                            Expander(
                                record.id, cloneElement(columnCell, { innerProps: { record } }), expandedRecordIds, setExpandedRecordIds,
                                onRowClick, classes, cx, customProps?.expander?.chevronIcon, customProps?.expander?.actionIcon,
                                expansion.allowMultiple
                            )
                        }</Box>
                        : <Box {...boxProps}>{cloneElement(columnCell, { innerProps: { record } })}</Box>
                } else {
                    return expansion.enabled && column.expander
                        ? <Box {...boxProps}>{
                            Expander(
                                record.id, value, expandedRecordIds, setExpandedRecordIds,
                                onRowClick, classes, cx, customProps?.expander?.chevronIcon, customProps?.expander?.actionIcon,
                                expansion.allowMultiple
                            )
                        }</Box>
                        : <Box {...boxProps}>{value}</Box>
                }
            }

            return column
        })
    }, [columnsDef, expandedRecordIds, filters])

    // Sort
    const { sortStatus, setSortStatus } = useSort(noodlNode, sort, columns)
    const SortedIcon = R.libs.icons[sort.sortedIcon || 'IconArrowUp']
    const UnsortedIcon = R.libs.icons[sort.unsortedIcon || 'IconSelector']

    // Input signals
    useImperativeHandle(ref, () => ({
        table2ResetSingleSelection() { setSelectedRecord(undefined) },
        table2ResetMultiSelection() { setSelectedRecords([]) },
        table2ResetSort() { setSortStatus(undefined) },
        table2ResetFilters() { resetFilters(); forceUpdate() },
        table2ExpandAll() { setExpandedRecordIds(items?.map(i => i.id) || []) },
        table2UnexpandAll() { setExpandedRecordIds([]) }
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

    //@ts-ignore
    return <ScopeProvider scope={TableScope} value={tableId}><Box w={dimensions.width}><DataTable<Item>
        columns={columns}
        records={getRecords(filter, columns, items, getColumnFilter, runFilterFunc, fetching, sortStatus)}
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
            expansion.enabled
                ? {
                    allowMultiple: expansion.allowMultiple,
                    trigger: onRowClick === 'expansion' ? 'click' : 'never',
                    expanded: { recordIds: expandedRecordIds, onRecordIdsChange: setExpandedRecordIds },
                    content: ({ record }) => {
                        if (expansionRow) expansionRow.props.noodlNode.props.innerProps = { record }
                        return expansionRow
                    },
                    collapseProps: { transitionDuration: 50, ...customProps?.collapseProps },
                } : undefined
        }
        // Table styles
        bodyRef={tableStyles.animation ? bodyRef : undefined}
        // Row styles
        rowClassName={({ id }) => (cx(
            { [classes.row]: rowStyles.enabled },
            { [classes.striped]: rowStyles.enabled && rowStyles.striped },
            { [classes.multiSelected]: rowStyles.enabled && selection.multi.enabled && selectedRecords?.map(i => i.id).includes(id) },
            { [classes.singleSelected]: rowStyles.enabled && selection.single.enabled && selectedRecord?.id === id }
        ))}
        sx={expansion.enabled && !rowStyles.rowBorders ? { '&&': { 'tbody tr td': { borderTop: 'none' } } } : undefined}
        // States
        fetching={fetching}
        {...libProps}
        {...customProps}
    /></Box></ScopeProvider>
})