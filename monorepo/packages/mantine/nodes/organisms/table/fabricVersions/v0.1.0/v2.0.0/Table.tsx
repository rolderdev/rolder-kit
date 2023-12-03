import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { forwardRef, useEffect, useState } from 'react';
import { TableCompProps200 } from './types/TableCompProps';
import { sendOutput } from '../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send';
import { useRowStyles } from './styles/styles';
import { useViewportSize } from '@mantine/hooks';

export default forwardRef(function (props: TableCompProps200) {

    const [selectedRecord, setSelectedRecord] = useState<RItem>()
    useEffect(() => setSelectedRecord(props.table2DefaultSelectedItem), [props.table2DefaultSelectedItem])

    const { classes: rowClasses } = useRowStyles({
        bgColor: props.table2RowBackgroundColor,
        onHoverBgColor: props.table2RowOnHoverBackgroundColor,
        selectedBgColor: props.table2SelectedRowBackgroundColor
    })

    const { height } = useViewportSize()

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' })
    useEffect(() => {
        if (props.table2DefaultSort) {
            const columnAccessor = Object.keys(props.table2DefaultSort[0])[0]
            const sortState = { columnAccessor, direction: props.table2DefaultSort[0][columnAccessor] }
            setSortStatus(sortState)
        }
    }, [props.table2DefaultSort])

    return <DataTable<RItem>
        columns={props.table2Columns}
        records={props.items}
        fetching={props.table2Fetching}
        w={props.table2Width}
        minHeight={80}
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
        onRowClick={props.table2SingleRowSelectable
            ? (item) => {
                setSelectedRecord(item)
                sendOutput(props.noodlNode, 'selectedItem', item)
            }
            : null}
        sortStatus={sortStatus}
        onSortStatusChange={(sort) => {
            sendOutput(props.noodlNode, 'table2Sort', [{ [sort.columnAccessor]: sort.direction }])
            setSortStatus(sort)
        }}
        {...props}
        {...props.customProps}
    />
})