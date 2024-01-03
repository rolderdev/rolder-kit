import { RItem } from "@rk/types";
import { ColumnDef } from "../types/Column";
import { getFormatedDate2, getMasked2, getValue8 } from "@rk/utils";
import { numbro } from "@rk/libs";

export default function (columnDef: ColumnDef, row: RItem) {
    switch (columnDef.data?.type) {
        case 'date': {
            const date = getFormatedDate2(row, columnDef.accessor, columnDef.data.dateFormat)
            if (date === 'Invalid Date') return ''
            else return date
        }
        case 'mask': return getMasked2(getValue8(row, columnDef.accessor, columnDef.data.default), columnDef.data.maskFormat || '')
        case 'number': return numbro(getValue8(row, columnDef.accessor, columnDef.data.default) || 0)
            .format(columnDef.data.numberFormat)
        case 'array': {
            let arr = getValue8(row, columnDef.accessor)
            if (Array.isArray(arr)) {
                const sortFn = columnDef.data?.arrayFormat?.sortFn
                if (sortFn && typeof sortFn === 'function') arr = sortFn(arr)
                return arr.map((i: any) => getValue8(i, columnDef.data?.arrayFormat?.accessor || ''))
                    .join(columnDef.data.arrayFormat?.join ? columnDef.data.arrayFormat.join : ', ')
            }
        }; break
        default: return getValue8(row, columnDef.accessor, columnDef.data?.default)
    }
}