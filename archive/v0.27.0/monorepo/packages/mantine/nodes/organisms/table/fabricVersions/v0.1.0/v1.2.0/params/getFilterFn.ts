import { MRT_FilterFn } from "mantine-react-table";
import { ColumnDef } from "../types/Column";

export default function (columnDef: ColumnDef) {
    const { dayjs } = window.R.libs
    const { getValue } = window.R.utils

    switch (columnDef.filterVariant) {
        case 'date-range': {
            const filterFn: MRT_FilterFn<RItem> = (row, _columnIds, filterValue) => dayjs(getValue.v7(row.original, columnDef.accessor))
                .isBetween(filterValue?.[0] || '1900-01-01', filterValue?.[1] || '2100-01-01', 'day', '[]')
            return filterFn
        }
    }
}