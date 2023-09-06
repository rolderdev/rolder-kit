import { MRT_Row } from "mantine-react-table";
import { convertColor } from "../../../../../../utils/converters/v0.1.0/converters";
import { TableCompProps } from "../types/TableCompProps";

export default function (props: { tableProps: TableCompProps, selectionProps: any, row: MRT_Row<Item> }) {
    const { highlightOnHover, onHoverColor, singleSelect, highlightSelected, selectedColor, singleUnselectable, grouped } = props.tableProps
    const { singleSelection, setSingleSelection } = props.selectionProps
    const { row } = props
    let returnProps: any = { sx: {} }

    if (highlightOnHover && onHoverColor) returnProps.sx['&:hover td'] = { backgroundColor: convertColor(onHoverColor) }
    if (highlightSelected && singleSelection === row.id) returnProps.sx['& td'] = { backgroundColor: convertColor(selectedColor) }

    if (singleSelect || row.getIsGrouped()) returnProps.sx.cursor = 'pointer'
    if (singleSelect && !row.getIsGrouped()) returnProps.onClick = () => {
        if (singleSelection !== row.id) setSingleSelection(row.id)
        else if (singleUnselectable) setSingleSelection('')
    }
    if (grouped && row.getIsGrouped()) returnProps.onClick = () => { if (row.getIsGrouped()) row.toggleExpanded(!row.getIsExpanded()) }

    return returnProps
}