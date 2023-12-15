import { Group, Text } from "@mantine/core"
import { Column } from "../types/Column"
import { TableCompProps } from "../types/TableCompProps"
import HeaderCheckbox from "./HeaderCheckbox"
import { Selection } from "../types/Selection"

export default function (props: { tableProps: TableCompProps, selectionProps: Selection, columnDef: Column }) {
    const { multiSelect, allSelect } = props.tableProps
    let ml = 0
    if (multiSelect && !allSelect) ml = 36

    return <Group noWrap>
        <HeaderCheckbox {...props} />
        <Text ml={ml}>{props.columnDef.header}</Text>
    </Group>
}