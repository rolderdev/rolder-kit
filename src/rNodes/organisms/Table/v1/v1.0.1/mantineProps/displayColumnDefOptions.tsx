import { MantineColor } from "@mantine/core"
import { MRT_RowSelectionState, MRT_TableOptions } from "mantine-react-table"
import { Column } from "../types/Column"
import { MultiSelectionHeader } from "../comps/MultiSelectionHeader"
import { MultiSelectionRow } from "../comps/MultiSelectionRow"
import { NodeInstance } from "@noodl/noodl-sdk"

export default function displayColumnDefOptions(props: {
    groupColumnDef?: Column, multiSelect: boolean, multiSelection: MRT_RowSelectionState, setMultiSelection: any, allSelect: boolean,
    noodlNode: NodeInstance, allSelectionHandler: any, multiSelectCheckboxColor: MantineColor, loading: boolean, allSelected: boolean,
    partialSelected: boolean,
}): MRT_TableOptions<Item>['displayColumnDefOptions'] {
    const hedaerProps = { header: props.groupColumnDef?.header, ml: props.multiSelect ? 5 : 0, ...props }

    return {
        'mrt-row-expand': {
            Cell: ({ row, cell }) => <MultiSelectionRow row={row} cell={cell} {...props} />,
            Header: ({ column }) => <MultiSelectionHeader column={column} {...hedaerProps} />,
            size: props.groupColumnDef?.size
        },
    }
}