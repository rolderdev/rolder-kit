import { Checkbox } from "@mantine/core"
import { MRT_Row, } from "mantine-react-table"
import { TableCompProps } from "../types/TableCompProps"
import { Selection } from "../types/Selection"

export default function (props: { row: MRT_Row<NItem>, tableProps: TableCompProps, selectionProps: Selection }) {
    const { multiSelectCheckboxColor, multiSelect } = props.tableProps
    const { row } = props
    const { multiSelection, setMultiSelection } = props.selectionProps

    if (multiSelect) return <Checkbox
        color={multiSelectCheckboxColor}
        checked={multiSelection[row.id]}
        onChange={(e) => setMultiSelection({ [row.id]: e.currentTarget.checked })}
        onClick={(e) => e.stopPropagation()}
    />
    else return <></>
}