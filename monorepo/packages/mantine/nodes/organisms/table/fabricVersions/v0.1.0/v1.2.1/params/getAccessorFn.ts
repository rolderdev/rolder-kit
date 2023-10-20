import { ColumnDef } from "../types/Column";

export default function (columnDef: ColumnDef, row: RItem) {
    const { numbro } = window.R.libs
    const { getFormatedDate, getMasked, getValue } = window.R.utils
    
    switch (columnDef.data?.type) {
        case 'date': {
            const date = getFormatedDate.v2(row, columnDef.accessor, columnDef.data.dateFormat)
            if (date === 'Invalid Date') return ''
            else return date
        }
        case 'mask': return getMasked.v2(
            { type: 'pattern', maskPattern: columnDef.data.maskFormat },
            getValue.v7(row, columnDef.accessor, columnDef.data.default)
        )
        case 'number': return numbro(getValue.v7(row, columnDef.accessor, columnDef.data.default) || 0)
            .format(columnDef.data.numberFormat)
        case 'array': {
            let arr = getValue.v7(row, columnDef.accessor)
            if (Array.isArray(arr)) {
                const sortFn = columnDef.data?.arrayFormat?.sortFn
                if (sortFn && typeof sortFn === 'function') arr = sortFn(arr)
                return arr.map((i: any) => getValue.v7(i, columnDef.data?.arrayFormat?.accessor || ''))
                    .join(columnDef.data.arrayFormat?.join ? columnDef.data.arrayFormat.join : ', ')
            }
        }; break
        default: return getValue.v7(row, columnDef.accessor, columnDef.data?.default)
    }
}