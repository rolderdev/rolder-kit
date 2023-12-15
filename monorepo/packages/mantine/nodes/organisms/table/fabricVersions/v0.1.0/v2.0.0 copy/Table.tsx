import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { TableCompProps200 } from './types/TableCompProps';
import { DataTable, DataTableSortStatus } from './lib';
import { Box, Text } from '@mantine/core';
import useRowStyles from './styles/useRowStyles';
import { sendOutput, sendSignal } from '../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import getRecords from './funcs/getRecords';
import getColumns from './funcs/getColumns';
import icons from '../../../../../../libs/icons/v0.2.0/icons';
import { useForceUpdate } from '@mantine/hooks';
import { action, deepMap } from 'nanostores';
import { ColumnDef200 } from './types/Column';

type Filter = {
    func?: ColumnDef200['filterFunc']
    value?: any
}

type SetFilter = {
    noodlNode: NoodlNode
    columnIdx: number
    filter: Filter
}

export const records = deepMap<{ [noodleNodeId: string]: RItem[] }>({})
export const filters = deepMap<{ [noodleNodeId: string]: { [idx: string]: Filter } }>({})

export const setFilter = action(filters, 'setFilter', (store, props: SetFilter) => {
    const { noodlNode, columnIdx, filter } = props    
    console.log(store.get()[noodlNode.id])
    store.setKey(`${noodlNode.id}.${columnIdx}`, filter)
    console.log(store.get()[noodlNode.id])
})

export default forwardRef(function (props: TableCompProps200, ref) {
    const {
        noodlNode, customProps, table2Columns, table2Items, table2SingleSelectedItem, table2MultiSelectedItems, table2Fetching, table2Sort,
        table2SortType, table2SortedIcon, table2UnsortedIcon, table2Layout, table2Dimensions, table2TableStyles, table2RowStyles
    } = props

    useEffect(() => {
        records.setKey(noodlNode.id, table2Items)
        forceUpdate()
    }, [table2Items])

    // Single selection
    const [selectedRecord, setSelectedRecord] = useState<RItem>()
    useEffect(() => { setSelectedRecord(table2SingleSelectedItem) }, [table2SingleSelectedItem])
    useEffect(() => {
        if (selectedRecord) {
            sendOutput(noodlNode, 'table2SingleSelectedItem', selectedRecord)
            sendSignal(noodlNode, 'table2SingleSelected')

        } else {
            sendOutput(noodlNode, 'table2SingleSelectedItem', null)
            sendSignal(noodlNode, 'table2SingleUnselected')
        }
    }, [selectedRecord])

    // Multi selection
    const [selectedRecords, setSelectedRecords] = useState<RItem[]>([])
    useEffect(() => { if (table2MultiSelectedItems) setSelectedRecords(table2MultiSelectedItems) }, [table2MultiSelectedItems])
    useEffect(() => {
        if (selectedRecords?.length) sendOutput(noodlNode, 'table2MultiSelectedItems', selectedRecords)
        else sendOutput(noodlNode, 'table2MultiSelectedItems', selectedRecords || [])
        sendSignal(noodlNode, 'table2MultiSelectionChanged')
    }, [selectedRecords])

    // Sort
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>()
    useEffect(() => {
        if (table2Sort) {
            const defaultSortColumn = table2Columns.find(i => i.sort?.default)
            if (!sortStatus && defaultSortColumn && defaultSortColumn.sort) setSortStatus({
                columnAccessor: defaultSortColumn.accessor,
                direction: defaultSortColumn.sort.default
            })
        }
    }, [table2Sort, table2SortType, table2Columns])
    useEffect(() => {
        if (sortStatus) {
            sendOutput(noodlNode, 'table2SortValue', [{ [sortStatus.columnAccessor]: sortStatus.direction }])
        } else sendOutput(noodlNode, 'table2SortValue', null)
    }, [sortStatus])
    const SortedIcon = icons(table2SortedIcon || 'IconArrowUp')
    const UnsortedIcon = icons(table2UnsortedIcon || 'IconSelector')

    // Filter
    const forceUpdate = useForceUpdate()
    function Filter(columnIdx: number, filterValue?: any) {
        console.log(columnIdx, filterValue)        
        filters.setKey(`${noodlNode.id}.${columnIdx}.value`, filterValue || undefined)
        //setFilter({noodlNode, columnIdx})

        let filteredRecords = [...table2Items]
        Object.values(filters.get()[noodlNode.id]).forEach((filter, idx) => {
            const fv = filter.value
            const isNotEmpty = Array.isArray(fv) ? fv?.length : fv
            //console.log(idx, filterFunc, filterValues.get()[noodlNode.id], isNotEmpty)
            if (filter.func && isNotEmpty) filteredRecords = filter.func(filteredRecords, fv)
        })
        records.setKey(noodlNode.id, filteredRecords)
        forceUpdate()
    }

    // Reseters
    useImperativeHandle(ref, () => ({
        table2ResetSingleSelection() { setSelectedRecord(undefined) },
        table2ResetMultiSelection() { setSelectedRecords([]) },
        table2ResetSort() { setSortStatus(undefined) }
    }), [])


    /* const [expandedRecordIds, setExpandedRecordIds] = useState<string[]>([])
    useEffect(() => {
        sendOutput(noodlNode, 'table2ExpandedItems', items?.filter(i => expandedRecordIds.includes(i.id)))
        sendSignal(noodlNode, 'table2ExpandChanged')
    }, [expandedRecordIds]) */

    /* const tableRow = Array.isArray(props.children)
        ? props.children.filter(i => i.props.noodlNode.model.type.split('.')[1] === 'TableRow')?.[0]
        : props.children?.props.noodlNode.model.type.split('.')[1] === 'TableRow'
            ? props.children
            : null */
    /* const tableCells = Array.isArray(props.children)
        ? props.children.filter(i => i.props.noodlNode.model.type.split('.')[1] === 'TableCell')
        : props.children?.props.noodlNode.model.type.split('.')[1] === 'TableCell'
            ? [props.children]
            : []
 */
    /* const columns = props.table2Columns.map((i, idx) => {
        //const tc = tableCells.find((i: any) => i.props.noodlNode.props.table2ColumnIndex === idx)
        //if (tc) 
        i.render = (record: RItem) => {
            const tableCell = tableCells.find((i: any) => i.props.noodlNode.props.table2ColumnIndex === idx)
            tableCell.props.noodlNode.resultProps.tableItem = record
            return () => tableCell
        }
        return i
    }) */

    // Table styles
    const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>()
    const [animation, setAnimation] = useState(false)
    useEffect(() => {
        if (!table2Fetching && !animation && props.table2Animation)
            setTimeout(() => setAnimation(true), 100)
    }, [table2Fetching])

    // Row styles
    const { classes, cx } = useRowStyles({
        rowBorders: props.table2RowBorders, oddBgColor: props.table2OddBgColor, evenBgColor: props.table2EvenBgColor,
        rowBgColor: props.table2RowBgColor, onHoverBgColor: props.table2OnHoverBgColor, striped: props.table2Striped,
        singleSelectedRowBgColor: props.table2SingleSelectedRowBgColor, mutliSelectedRowBgColor: props.table2MutliSelectedRowBgColor
    })

    console.log('render')

    return <Box w={table2Dimensions ? props.table2Width : undefined}><DataTable<RItem>
        // Params    
        columns={getColumns(props, Filter)}
        textSelectionDisabled={!props.table2TextSelection}
        // Data
        records={getRecords({ sortStatus, props })}
        onRowClick={
            // Single selection
            props.table2SingleSelection && props.table2OnRowClick === 'singleSelection'
                ? (item) => {
                    if (selectedRecord?.id === item.id && props.table2Unselectable) setSelectedRecord(undefined)
                    else setSelectedRecord(item)
                }
                : null
        }
        // Multi selection
        selectedRecords={props.table2MultiSelection ? selectedRecords : undefined}
        onSelectedRecordsChange={setSelectedRecords}
        // Sort
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        sortIcons={{
            sorted: SortedIcon && <SortedIcon size={14} {...customProps?.sortedIcon} />,
            unsorted: UnsortedIcon && <UnsortedIcon size={14} {...customProps?.unsortedIcon} />,
        }}

        // Layout
        noHeader={table2Layout && props.table2NoHeader}
        // Dimensions        
        minHeight={(table2Dimensions && props.table2MinHeight) || 126}
        horizontalSpacing={(table2Dimensions && props.table2HorizontalSpacing) || 'sm'}
        verticalSpacing={(table2Dimensions && props.table2VerticalSpacing) || 'xs'}
        fontSize={(table2Dimensions && props.table2FontSize) || 'sm'}
        scrollAreaProps={{ scrollAreaBottomOffset: (table2Dimensions && props.table2ViewportBOffset) || 0, ...customProps?.scrollAreaProps }}
        // Table styles
        shadow={(table2TableStyles && props.table2Shadow) || 'sm'}
        withBorder={table2TableStyles && props.table2WithBorder}
        borderRadius={(table2TableStyles && props.table2BorderRadius) || 'md'}
        withColumnBorders={table2TableStyles && props.table2ColumnBorders}
        emptyState={<Text color="dimmed" size="sm">Записей не найдено</Text>}
        bodyRef={table2TableStyles && animation ? bodyRef : undefined}
        // Row styles
        rowClassName={({ id }) => (cx(
            { [classes.row]: table2RowStyles },
            { [classes.striped]: table2RowStyles && props.table2Striped },
            { [classes.multiSelected]: table2RowStyles && props.table2MultiSelection && selectedRecords?.map(i => i.id).includes(id) },
            { [classes.singleSelected]: table2RowStyles && props.table2SingleSelection && selectedRecord?.id === id },
        ))}
        striped={props.table2Striped}
        highlightOnHover={props.table2HighlightOnHover}
        // Loader styles
        loaderSize={props.customProps?.loader?.size || 'xl'}
        loaderVariant={props.customProps?.loader?.variant || 'dots'}
        loaderColor={props.table2LoaderColor}
        loaderBackgroundBlur={props.customProps?.loader?.bgBlur || 0.5}
        loaderBgColor={props.customProps?.loader?.bgColor || 'dark'}
        loaderOpacity={props.customProps?.loader?.opacity || 0.1}
        // States
        fetching={table2Fetching}

        /*
        rowExpansion={{
            allowMultiple: true,
            expanded: { recordIds: expandedRecordIds, onRecordIdsChange: setExpandedRecordIds },
            content: ({ record }) => {
                if (tableRow) {
                    tableRow.props.noodlNode.resultProps.tableItem = record
                    return tableRow
                } else return null
            },
        }} */
        {...props}
        {...props.customProps}
    /></Box>
})