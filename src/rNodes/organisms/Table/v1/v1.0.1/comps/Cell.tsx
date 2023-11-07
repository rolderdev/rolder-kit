import { Group } from "@mantine/core"
import { MRT_Cell, MRT_Column, MRT_Row } from "mantine-react-table"

export function BaseHeader({ column }: { column: MRT_Column }) {
    return <>{column?.columnDef.header}</>
}

export function Cell(props: { cell: MRT_Cell<Item>, row: MRT_Row<Item> }) {
    const { cell } = props
    return (
        <Group noWrap>
            {`${cell.getValue()}`}
        </Group>
    )
}