import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { forwardRef, useEffect, useState } from 'react';
import { TableCompProps200 } from './types/TableCompProps';
import { sendOutput, sendSignal } from '../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send';
import { useRowStyles } from './styles/styles';
import { useViewportSize } from '@mantine/hooks';
import { Text } from '@mantine/core';

export default forwardRef(function (props: TableCompProps200) {
    const { noodlNode, items } = props

    const [selectedRecord, setSelectedRecord] = useState<RItem>()
    useEffect(() => setSelectedRecord(props.table2DefaultSelectedItem), [props.table2DefaultSelectedItem])

    const { classes: rowClasses } = useRowStyles({
        bgColor: props.table2RowBackgroundColor,
        onHoverBgColor: props.table2RowOnHoverBackgroundColor,
        selectedBgColor: props.table2SelectedRowBackgroundColor
    })

    const { height } = useViewportSize()

    const [sortsStatus, setSortsStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' })
    useEffect(() => {
        if (props.table2DefaultSort) {
            const columnAccessor = Object.keys(props.table2DefaultSort[0])[0]
            const sortsStatus = { columnAccessor, direction: props.table2DefaultSort[0][columnAccessor] }
            setSortsStatus(sortsStatus)
        }
    }, [props.table2DefaultSort])

    const [expandedRecordIds, setExpandedRecordIds] = useState<string[]>([])
    useEffect(() => {
        sendOutput(noodlNode, 'table2ExpandedItems', items?.filter(i => expandedRecordIds.includes(i.id)))
        sendSignal(noodlNode, 'table2ExpandChanged')
    }, [expandedRecordIds])

    const tableRow = Array.isArray(props.children)
        ? props.children.filter(i => i.props.noodlNode.model.type.split('.')[1] === 'TableRow')?.[0]
        : props.children?.props.noodlNode.model.type.split('.')[1] === 'TableRow'
            ? props.children
            : null
    const tableCells = Array.isArray(props.children)
        ? props.children.filter(i => i.props.noodlNode.model.type.split('.')[1] === 'TableCell')
        : props.children?.props.noodlNode.model.type.split('.')[1] === 'TableCell'
            ? [props.children]
            : []

    const columns = props.table2Columns.map((i, idx) => {
        //const tc = tableCells.find((i: any) => i.props.noodlNode.props.table2ColumnIndex === idx)
        //if (tc) 
        i.render = (record: RItem) => {
            const tableCell = tableCells.find((i: any) => i.props.noodlNode.props.table2ColumnIndex === idx)
            tableCell.props.noodlNode.resultProps.tableItem = record
            return () => tableCell
        }
        return i
    })

    return <DataTable<RItem>
        columns={columns}
        records={props.items}
        fetching={props.table2Fetching}
        w={props.table2Width}
        minHeight={props.table2MinHeight}
        height={props.table2DynamicHeight ? height - props.table2ViewportBOffset : props.table2MaxHeight}
        shadow={props.table2Shadow}
        withBorder={props.table2WithBorder}
        noHeader={props.table2NoHeader}
        borderRadius={props.table2BorderRadius}
        withColumnBorders={props.table2WithColumnBorders}
        striped={props.table2Striped}
        highlightOnHover={props.table2HighlightOnHover}
        horizontalSpacing={props.table2HorizontalSpacing}
        verticalSpacing={props.table2VerticalSpacing}
        fontSize={props.table2FontSize}
        rowClassName={({ id }) => (props.table2SingleRowSelectable && id === selectedRecord?.id ? rowClasses.selected : rowClasses.base)}
        emptyState={<Text color="dimmed" size="sm">Записей не найдено</Text>}
        onRowClick={props.table2SingleRowSelectable
            ? (item) => {
                setSelectedRecord(item)
                sendOutput(props.noodlNode, 'selectedItem', item)
            }
            : null}
        sortStatus={sortsStatus}
        onSortStatusChange={(sort) => {
            sendOutput(props.noodlNode, 'table2Sorts', [{ [sort.columnAccessor]: sort.direction }])
            setSortsStatus(sort)
        }}
        rowExpansion={{
            allowMultiple: true,
            expanded: { recordIds: expandedRecordIds, onRecordIdsChange: setExpandedRecordIds },
            content: ({ record }) => {
                if (tableRow) {
                    tableRow.props.noodlNode.resultProps.tableItem = record
                    return tableRow
                } else return null
            },
        }}
        {...props}
        {...props.customProps}
    />
})