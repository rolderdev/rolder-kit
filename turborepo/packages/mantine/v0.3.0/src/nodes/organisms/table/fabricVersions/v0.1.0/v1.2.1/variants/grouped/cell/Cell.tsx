import { ReactNode } from "react";
import { ColumnDef } from "../../../types/Column";
import { Checkbox, Group, Skeleton } from "@mantine/core";
import { TableCompProps } from "../../../types/TableCompProps";
import { MRT_Row, MRT_TableInstance } from "mantine-react-table";
import Value from "../../../cell/Value";
import { useElementSize, usePrevious } from "@mantine/hooks";
import { useAtomValue, useSetAtom } from "jotai";
import { currentViewPortWidthAtom } from "../../../Table";
import useAction from "../../../actions/useAction";
import { getSelectedAtom, setSelectionAtom } from "../../../selection/multiSelection";
import { RItem } from "@rk/types";
import clamp from "just-clamp";

export default function (
    tableProps: TableCompProps, columnDef: ColumnDef, table: MRT_TableInstance<RItem>, row: MRT_Row<RItem>, renderedCellValue: ReactNode
) {
    const { noodlNode, multiSelectable, multiSelectCheckboxColor, tableLoading } = tableProps

    const { ref, width } = useElementSize()
    const currentViewPortWidth = useAtomValue(currentViewPortWidthAtom)
    const prevViewPortWidth = usePrevious(currentViewPortWidth) || currentViewPortWidth
    const currentSize = clamp(
        columnDef.size || tableProps.defaultColumnSize,
        width + currentViewPortWidth - prevViewPortWidth,
        1000)

    const selectedItems = useAtomValue(getSelectedAtom)
    const setSelection = useSetAtom(setSelectionAtom)

    const actions = columnDef.actions?.map(i => { return useAction(tableProps, i, row, columnDef.hoverableActions || false) })
    const position = columnDef.actionsOnly ? 'center' : actions?.length ? 'apart' : 'left'

    return <Skeleton visible={tableLoading}>
        <Group ref={ref} position={position} noWrap>
            {!columnDef.actionsOnly &&
                <Group noWrap>
                    {multiSelectable && table._getColumnDefs()[0]?.header === columnDef.header && <Checkbox
                        color={multiSelectCheckboxColor}
                        checked={selectedItems[row.original.id]}
                        onChange={(e) => setSelection(noodlNode, table, row.original.id, e.currentTarget.checked)}
                        onClick={(e) => e.stopPropagation()}
                    />}
                    {Value(columnDef, renderedCellValue, currentSize)}
                </Group>}
            <Group position='right' noWrap>{actions}</Group>
        </Group>
    </Skeleton>
}