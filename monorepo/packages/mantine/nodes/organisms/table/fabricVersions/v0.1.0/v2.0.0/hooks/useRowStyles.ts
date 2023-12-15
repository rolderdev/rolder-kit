import { createStyles } from "@mantine/core";
import convertColor from "../../../../../../../utils/convertColor/v0.2.0/convertColor";
import { TableProps200 } from "../types/TableProps";

export default createStyles((_, {
    rowBorders, striped, oddBgColor, evenBgColor, rowBgColor, onHoverBgColor, singleSelectedRowBgColor, mutliSelectedRowBgColor
}: TableProps200['rowStyles']) => ({
    row: {
        '&&': {
            backgroundColor: striped ? undefined : convertColor(rowBgColor),
            '&& td': { borderTop: rowBorders ? undefined : 'unset', },
            '&&': { '&&:hover': { backgroundColor: convertColor(onHoverBgColor) } }
        },
    },
    striped: {
        '&&': {
            '&&:nth-child(odd)': { backgroundColor: convertColor(oddBgColor) },
            '&:nth-child(even)': { backgroundColor: convertColor(evenBgColor) },
        },
    },
    multiSelected: { '&&': { '&&': { '&&': { backgroundColor: convertColor(mutliSelectedRowBgColor) } } } },
    singleSelected: { '&&': { '&&': { '&&': { backgroundColor: convertColor(singleSelectedRowBgColor) } } } },
}));