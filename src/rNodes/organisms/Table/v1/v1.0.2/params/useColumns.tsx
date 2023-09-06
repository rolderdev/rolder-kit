
import Cell from '../cells/Cell';
import Header from '../headers/Header';
import { Selection } from '../types/Selection';
import { TableCompProps } from '../types/TableCompProps';
import getAccessorFn from './getAccessorFn';
import getFilterFn from './getFilterFn';
import omit from 'just-omit';
import insert from 'just-insert';

export default function useColumns(props: { tableProps: TableCompProps, selectionProps: Selection }) {
    const { tableProps, selectionProps } = props
    let { columns, grouped } = tableProps

    if (grouped) {
        const groupColumn = columns.find(i => i.groupScheme)
        const groupScheme = groupColumn?.groupScheme
        if (groupScheme) {
            columns = insert(columns, groupScheme.map(i => ({
                id: i.groupBy,
                accessor: i.accessor,
                ...omit(groupColumn, ['id', 'accessor'])
            })), 1)
        }
    }

    const resultColumns = columns.map((columnDef, idx) => {
        columnDef.accessorFn = row => getAccessorFn(columnDef, row)
        columnDef.enableColumnFilter = columnDef.enableColumnFilter || false
        if (columnDef.filterVariant) columnDef.filterFn = getFilterFn(columnDef)
        if (idx === 0) {
            columnDef.Header = () => <Header tableProps={tableProps} selectionProps={selectionProps} columnDef={columnDef} />
            columnDef.Cell = ({ row, cell }) => <Cell
                tableProps={tableProps} selectionProps={selectionProps} columnDef={columnDef} row={row} cell={cell}
            />
        }

        return columnDef
    })

    return resultColumns
}