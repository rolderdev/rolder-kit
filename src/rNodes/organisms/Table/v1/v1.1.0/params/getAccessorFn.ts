import { Column } from "../types/Column";
import { getDate, getMasked } from "../../../../../../utils/data/v0.3.0/data";
import getValue from "../../../../../../utils/data/getValue/v0.5.0/getValue";
import numbro from "numbro";


export default function (columnDef: Column, row: NItem) {    
    switch (columnDef.dataType) {
        case 'date': {
            const date = getDate(row, columnDef.accessor, columnDef.dateFormat)
            if (date === 'Invalid Date') return ''
            else return date
        }
        case 'mask': return getMasked(getValue(row, columnDef.accessor, columnDef.defaultValue), columnDef.maskFormat)
        case 'number': return numbro(getValue(row, columnDef.accessor, columnDef.defaultValue) || 0).format(columnDef.numberFormat)
        default: return getValue(row, columnDef.accessor, columnDef.defaultValue)
    }
}