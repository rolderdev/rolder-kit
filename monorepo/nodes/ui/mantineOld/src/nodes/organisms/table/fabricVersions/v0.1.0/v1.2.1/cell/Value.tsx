import { ReactNode } from "react";
import { ColumnDef } from "../types/Column";
import { Sx, Text, Tooltip } from "@mantine/core";

export default function (columnDef: ColumnDef, renderedCellValue: ReactNode, currentSize: number) {
    let textProps: any = {}
    const maxSize = columnDef.cell?.maxSize || 300

    if (columnDef.cell?.trancate && !columnDef.cell?.lineClamp && !columnDef.cell?.respectLineBreak) textProps = {
        w: currentSize > maxSize ? maxSize : currentSize,
        truncate: columnDef.cell?.trancate || undefined,
        sx: { whiteSpace: 'nowrap' } as Sx
    }
    if (!columnDef.cell?.trancate && columnDef.cell?.lineClamp || columnDef.cell?.respectLineBreak) textProps = {
        w: currentSize > maxSize ? maxSize : currentSize,
        lineClamp: columnDef.cell?.lineClamp,
        sx: { whiteSpace: columnDef.cell?.respectLineBreak ? 'pre-line' : 'normal' } as Sx
    }

    return columnDef.cell?.tooltip
        ? <Tooltip
            color={columnDef.cell.tooltipColor}
            position='top-start'
            withArrow
            label={renderedCellValue}
        >
            <Text {...textProps}>{renderedCellValue}</Text>
        </Tooltip>
        : <Text {...textProps} >{renderedCellValue}</Text>
}