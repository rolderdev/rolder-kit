import { createStyles } from "@mantine/core";
import { TableProps } from "../../types";
import convertColor from "@shared/convert-color";

export default createStyles((_, {
    rowBorders, striped, oddBgColor, evenBgColor, rowBgColor, onHoverBgColor, singleSelectedRowBgColor, mutliSelectedRowBgColor
}: TableProps['rowStyles']) => ({
    row: {
        '&&': {
            backgroundColor: striped ? undefined : convertColor(rowBgColor),
            '&& td': { borderTop: rowBorders ? undefined : 'unset', },
            '&&': { '&&:hover': { backgroundColor: convertColor(onHoverBgColor) } }
        },
    },
    striped: {
        '&&': {
            '&&:nth-of-type(odd)': { backgroundColor: convertColor(oddBgColor) },
            '&:nth-of-type(even)': { backgroundColor: convertColor(evenBgColor) },
        },
    },
    multiSelected: { '&&': { '&&': { '&&': { backgroundColor: convertColor(mutliSelectedRowBgColor) } } } },
    singleSelected: { '&&': { '&&': { '&&': { backgroundColor: convertColor(singleSelectedRowBgColor) } } } },
    expandIcon: { transition: 'transform 0.2s ease' },
    expandIconRotated: { transform: 'rotate(90deg)' },
}));