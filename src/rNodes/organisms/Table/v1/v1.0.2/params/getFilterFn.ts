import { Column } from "../types/Column";
import { getValue } from "../../../../../../utils/data/v0.2.0/data";
import { MRT_FilterFn } from "mantine-react-table";
import dayjs from "dayjs";

export default function (columnDef: Column) {
    switch (columnDef.filterVariant) {
        case 'date-range': {
            const filterFn: MRT_FilterFn<Item> = (row, _columnIds, filterValue) =>
                dayjs(getValue(row.original, columnDef.accessor)).isBetween(filterValue?.[0], filterValue?.[1], 'day', '[]')
            return filterFn
        }
    }
}