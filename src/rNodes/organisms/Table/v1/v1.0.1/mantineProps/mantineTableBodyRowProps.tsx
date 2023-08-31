import { NodeInstance } from "@noodl/noodl-sdk"
import { MRT_Row, MRT_RowSelectionState, MRT_TableOptions } from "mantine-react-table"
import { MantineColor, Sx } from "@mantine/core"
import { convertColor } from "../../../../../../utils/converters/v0.1.0/converters"

export default function mantineTableBodyRowProps(props: {
    row: MRT_Row<Item>, noodlNode: NodeInstance, singleSelect: boolean, setSingleRowSelection: any, singleRowSelection: MRT_RowSelectionState,
    highlightSelected: boolean, selectedColor: MantineColor, highlightOnHover: boolean, onHoverColor: MantineColor, backgroundColor: MantineColor
}): MRT_TableOptions['mantineTableBodyRowProps'] {
    const {
        row, noodlNode, singleSelect, setSingleRowSelection, singleRowSelection, highlightSelected, selectedColor, highlightOnHover, onHoverColor,
        backgroundColor
    } = props
    let sx: Sx = {}
    let returnProps: any = { sx }
    if (highlightOnHover) {
        let color = onHoverColor
        if (!color) color = backgroundColor
            ? `${backgroundColor.split('.')[0]}.${parseInt(backgroundColor.split('.')[1]) + 1 || 0}`
            : 'blue.0'
        sx['&:hover td'] = { backgroundColor: convertColor(color) }
    }
    if (highlightSelected && singleRowSelection[row.id]) sx['& td'] = { backgroundColor: convertColor(selectedColor) }
    if (singleSelect || row.getIsGrouped()) sx.cursor = 'pointer'
    if (row.getIsGrouped()) returnProps.onClick = () => { if (row.getIsGrouped()) row.toggleExpanded(!row.getIsExpanded()) }
    if (singleSelect && !row.getIsGrouped()) {
        returnProps.onClick = () => {
            setSingleRowSelection({ [row.id]: singleRowSelection[row.id] ? false : true })
            noodlNode.outputPropValues.selectedItem = row.original
            noodlNode.flagOutputDirty('selectedItem')
            noodlNode.sendSignalOnOutput('singleSelected')
        }
    }

    return returnProps
}