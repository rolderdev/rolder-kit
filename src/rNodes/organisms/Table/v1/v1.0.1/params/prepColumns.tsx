import { getValue, getDate } from '../../../../../../utils/data/v0.3.0/data';
import dayjs from "dayjs";
import { Column } from '../types/Column';

export default function prepColumns(columns: Column[]) {
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

        // for second and next columns
        /* if (i.actions?.length) {
            i.Cell = ({ row, cell }) => {
                console.log('sdfsdf')
                return (
                    <Group position={cell.getValue() ? 'apart' : 'center'} noWrap >
                        {`${cell.getValue()}`}
                        {i.actions.map(actionDef => useAction({ node, actionDef, row }))}
                    </Group>
                )
        return <>TEST</>
        }
        } */

        return i
    })
}