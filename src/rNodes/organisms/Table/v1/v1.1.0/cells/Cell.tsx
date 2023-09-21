import { Group, Text } from "@mantine/core"
import { MRT_Cell, MRT_Row } from "mantine-react-table"
import useAction from "../hooks/useAction"
import { Column } from "../types/Column"
import { Selection } from "../types/Selection"
import { TableCompProps } from "../types/TableCompProps"
import CellCheckbox from "./CellCheckbox"

export default function (props: {
    tableProps: TableCompProps, selectionProps: Selection, row: MRT_Row<NItem>, cell: MRT_Cell<NItem>, columnDef: Column,
}) {
    const { row, cell, columnDef, tableProps, selectionProps } = props
    const actions = columnDef.actions?.map(i => { return useAction({ actionDef: i, row, tableProps, selectionProps }) })

    return <Group position={actions?.length ? 'apart' : 'left'} noWrap>
        <Group noWrap>
            <CellCheckbox {...props} />
            <Text>{cell.getValue<string>()}</Text>
        </Group>
        {!tableProps.loading && actions}
    </Group>
}