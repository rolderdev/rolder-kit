import { ReactNode } from "react";
import { ColumnDef } from "../types/Column";
import { Sx, Text, Tooltip } from "@mantine/core";

export default function (columnDef: ColumnDef, renderedCellValue: ReactNode) {
    let textProps: any = {}    

    if (columnDef.cell?.trancate && !columnDef.cell?.lineClamp && !columnDef.cell?.respectLineBreak) textProps = {        
        truncate: columnDef.cell?.trancate || undefined,
        sx: { whiteSpace: 'nowrap' } as Sx
    }
    if (!columnDef.cell?.trancate && columnDef.cell?.lineClamp || columnDef.cell?.respectLineBreak) textProps = {        
        lineClamp: columnDef.cell?.lineClamp,
        sx: { whiteSpace: columnDef.cell?.respectLineBreak ? 'pre-line' : 'normal' } as Sx
    }

    return columnDef.cell?.tooltip
        ? <Tooltip.Floating
            color={columnDef.cell.tooltipColor}
            multiline
            width={240}
            label={renderedCellValue}
        >
            <Text {...textProps}>{renderedCellValue}</Text>
        </Tooltip.Floating>
        : <Text {...textProps} >{renderedCellValue}</Text>
}