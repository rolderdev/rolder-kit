import { Checkbox } from "@mantine/core"
import { TableCompProps } from "../types/TableCompProps"
import { Selection } from "../types/Selection"

export default function (props: { tableProps: TableCompProps, selectionProps: Selection }) {
    const { multiSelectCheckboxColor, multiSelect, allSelect, loading, items } = props.tableProps
    const { allSelectionHandler, allSelected, partialSelected } = props.selectionProps
    const hasData = items?.length > 0

    if (multiSelect && allSelect) return <Checkbox
        color={multiSelectCheckboxColor}
        checked={allSelected && !loading}
        indeterminate={partialSelected}
        onChange={(e) => allSelectionHandler(e.currentTarget.checked)}
        onClick={(e) => e.stopPropagation()}
        disabled={!hasData}
    />
    else return <></>
}