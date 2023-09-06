import { Group } from "@mantine/core"
import { MRT_Cell, MRT_Row } from "mantine-react-table"
import useAction from "../hooks/useAction"
import { Column } from "../types/Column"
import { Selection } from "../types/Selection"
import { TableCompProps } from "../types/TableCompProps"
import CellCheckbox from "./CellCheckbox"

export default function (props: {
    tableProps: TableCompProps, selectionProps: Selection, row: MRT_Row<Item>, cell: MRT_Cell<Item>, columnDef: Column,
}) {
    const { row, cell, columnDef, tableProps, selectionProps } = props
    const actions = columnDef.actions?.map(i => { return useAction({ actionDef: i, row, tableProps, selectionProps }) })

    return <Group position={actions?.length ? 'apart' : 'left'} noWrap>
        <Group noWrap>
            <CellCheckbox {...props} />
            {cell.getValue<string>()}
        </Group>
        {!tableProps.loading && actions}
    </Group>
}