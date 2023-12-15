import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { DataTable } from './lib';
import { Box } from '@mantine/core';
import { TableProps200 } from './types/TableProps';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import useRowStyles from './styles/useRowStyles';
import useSingleSelection from './hooks/useSingleSelection';
import useMultiSelection from './hooks/useMultiSelection';
import useSort from './hooks/useSort';
import icons from '../../../../../../libs/icons/v0.2.0/icons';
import { getRecords, filters } from './funcs/getRecords';
import { getColumns } from './funcs/getColumns';
import { useForceUpdate } from '@mantine/hooks';

export default forwardRef(function (props: TableProps200, ref) {
    const { noodlNode, customProps, libProps, selection, sort, tableStyles, rowStyles } = props
    console.log('instance render')

    // Single selection
    const { selectedRecord, setSelectedRecord } = useSingleSelection(noodlNode, selection.single)
    // Multi selection
    const { selectedRecords, setSelectedRecords } = useMultiSelection(noodlNode, selection.multi)

    // Sort
    const { sortStatus, setSortStatus } = useSort(noodlNode, sort)
    const SortedIcon = icons(sort.sortedIcon || 'IconArrowUp')
    const UnsortedIcon = icons(sort.unsortedIcon || 'IconSelector')

    // Front filter    
    const forceUpdate = useForceUpdate()
    function setFilterValue(columnIdx: number, filterValue?: any) {
        filters.setKey(`${noodlNode.id}.${columnIdx}.value`, filterValue || undefined)
        forceUpdate()
    }

    // Reseters
    useImperativeHandle(ref, () => ({
        setSelectedRecord() { setSelectedRecord(undefined) },
        setSelectedRecords() { setSelectedRecords([]) },
        setSortStatus() { setSortStatus(undefined) }
    }), [])

    // Table styles
    const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>()
    const [animation, setAnimation] = useState(false)
    useEffect(() => {
        if (!libProps.fetching && !animation && tableStyles.animation)
            setTimeout(() => setAnimation(true), 100)
    }, [libProps.fetching])

    // Row styles
    const { classes, cx } = useRowStyles(rowStyles)

    return <Box w={props.dimensions.width}><DataTable<RItem>
        columns={getColumns(noodlNode, sort, props.children, setFilterValue)}
        records={getRecords(noodlNode.id, sort, sortStatus, libProps.fetching)}
        onRowClick={
            // Single selection
            selection.single.enabled && props.table2OnRowClick === 'singleSelection'
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

        // Table styles
        bodyRef={tableStyles.animation ? bodyRef : undefined}
        // Row styles
        rowClassName={({ id }) => (cx(
            { [classes.row]: rowStyles.enabled },
            { [classes.striped]: rowStyles.enabled && rowStyles.striped },
            { [classes.multiSelected]: rowStyles.enabled && selection.multi.enabled && selectedRecords?.map(i => i.id).includes(id) },
            { [classes.singleSelected]: rowStyles.enabled && selection.single.enabled && selectedRecord?.id === id },
        ))}

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
        {...props.libProps}
        {...customProps}
    /></Box>
})