import { getValue, getDate } from '../../../../../../utils/data/v0.3.0/data';
import dayjs from "dayjs";
import { Column } from '../types/Column';
import useActions from '../hooks/useActions';
import { NodeInstance } from '@noodl/noodl-sdk';
import { Group } from '@mantine/core';

export default function prepColumns(columns: Column[], noodlNode: NodeInstance) {
    return columns.map(i => {
        i.accessorFn = row => {
            switch (i.dataType) {
                case 'date': {
                    const date = getDate(row, i.accessor, i.dateFormat)
                    if (date === 'Invalid Date') return ''
                    else return date
                }
                default: return getValue(row, i.accessor)
            }
        }
        i.enableColumnFilter = i.enableColumnFilter || false
        if (i.filterVariant === 'date-range') {
            i.filterFn = (row, _columnIds, filterValue) =>
                dayjs(getValue(row.original, i.accessor)).isBetween(filterValue?.[0], filterValue?.[1], 'day', '[]')
        }
        if (i.actions?.length) i.Cell = ({ row, cell }) => i.actions.map(i => {
            return (
                <Group position={cell.getValue() ? 'apart' : 'center'} noWrap >
                    {`${cell.getValue()}`}
                    {useActions({ noodlNode, actionDef: i, row })}
                </Group>
            )
        })

        return i
    })
}