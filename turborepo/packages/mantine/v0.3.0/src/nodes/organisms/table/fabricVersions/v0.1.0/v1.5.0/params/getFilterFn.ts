import { MRT_FilterFn } from "mantine-react-table";
import { ColumnDef } from "../types/Column";
import { RItem } from "@rk/types";
import { dayjs } from "@rk/libs";
import { getValue8 } from "@rk/utils";

export default function (columnDef: ColumnDef) {
    switch (columnDef.filterVariant) {
        case 'date-range': {
            const filterFn: MRT_FilterFn<RItem> = (row, _columnIds, filterValue) => dayjs(getValue8(row.original, columnDef.accessor))
                .isBetween(filterValue?.[0] || '1900-01-01', filterValue?.[1] || '2100-01-01', 'day', '[]')
            return filterFn
        }
    }
}