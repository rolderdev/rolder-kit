import { ReactNode } from "react";
import { ColumnDef } from "../../../types/Column";
import { Avatar, Checkbox, Group } from "@mantine/core";
import { TableCompProps } from "../../../types/TableCompProps";
import { MRT_Row, MRT_TableInstance } from "mantine-react-table";
import Value from "../../../cell/Value";
import { useAtomValue, useSetAtom } from "jotai";
import { getSelectedAtom, setSelectionAtom } from "../../../selection/multiSelection";
import useAction from "../../../actions/useAction";

export default function (
    tableProps: TableCompProps, columnDef: ColumnDef, table: MRT_TableInstance<RItem>, row: MRT_Row<RItem>, renderedCellValue: ReactNode
) {
    const { noodlNode, multiSelectable, multiSelectCheckboxColor } = tableProps

    const selectedItems = useAtomValue(getSelectedAtom)
    const setSelection = useSetAtom(setSelectionAtom)

    const actions = columnDef.actions?.map(i => { return useAction(tableProps, i, row, columnDef.hoverableActions || false) })
    const position = columnDef.actionsOnly ? 'center' : actions?.length ? 'apart' : columnDef.cell?.align ? columnDef.cell.align : 'left'

    const defaultRender = <Group w={columnDef.size ? columnDef.size : undefined} position={position} noWrap>
        {!columnDef.actionsOnly &&
            <Group noWrap>
                {multiSelectable && table._getColumnDefs()[0].header === columnDef.header && <Checkbox
                    color={multiSelectCheckboxColor}
                    checked={selectedItems[row.original.id]}
                    onChange={(e) => setSelection(noodlNode, table, row.original.id, e.currentTarget.checked)}
                    onClick={(e) => e.stopPropagation()}
                />}
                {Value(columnDef, renderedCellValue)}
            </Group>}
        {actions?.length && <Group position='right' noWrap>{actions}</Group>}
    </Group>

    switch (columnDef.render?.comp) {
        case 'Avatar': return <Group w={columnDef.size ? columnDef.size : undefined} position={position} noWrap>
            <Avatar {...columnDef.render.props}>{Value(columnDef, renderedCellValue)}</Avatar>
        </Group>
        default: return defaultRender
    }
}