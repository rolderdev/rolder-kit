import { Column } from "../types/Column";
import { getDate, getMasked } from "../../../../../../utils/data/v0.3.0/data";
import getValue from "../../../../../../utils/data/getValue/v0.4.0/getValue";


export default function (columnDef: Column, row: Item) {
    switch (columnDef.dataType) {
        case 'date': {
            const date = getDate(row, columnDef.accessor, columnDef.dateFormat)
            if (date === 'Invalid Date') return ''
            else return date
        }
        case 'mask': return getMasked(getValue(row, columnDef.accessor), columnDef.maskFormat)
        default: return getValue(row, columnDef.accessor)
    }
}