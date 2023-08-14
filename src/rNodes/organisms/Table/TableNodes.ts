import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import Table_v0_2_0 from "./v0.2.0/Table"
import Table_v0_3_0 from "./v0.3.0/Table"


const { tableData, selectedItem, selectedItems } = reactPorts.Data
const { loading } = reactPorts.States
const { selected, resetSelected, doDelete, resetSingleSelected, resetMultipleSelected } = reactPorts.Signals
const { columns, noHeader, selectable, selectableType, highlightOnHover, highlightSelectedRow, selectFirstItem,
    singleRowSelectable, multipleRowSelectable } = reactPorts.Params
const { verticalSpacing } = reactPorts.Layout
const { w: { ...width }, h: { ...height } }: any = reactPorts.Dimensions
const { widthString, heightString } = reactPorts.ControlledDimensions
const { minHeight, fontSize } = reactPorts.Sx
const { shadow, borderRadius, withBorder, withColumnBorders, striped } = reactPorts.Style

const nodeName = 'Table'
const nodeVersions: RNode = {
    '0.2.0': {
        ReactComp: Table_v0_2_0,
        inputs: {
            ...reactPorts.Margins, columns, tableData, loading, shadow, fontSize, borderRadius, verticalSpacing, withBorder, withColumnBorders, width, widthString,
            height, heightString, minHeight, noHeader, selectable, selectableType, highlightOnHover, highlightSelectedRow, selectFirstItem, resetSelected, striped
        },
        outputs: { selectedItem, selected, doDelete },
        inputsToCheck: ['columns'],
        inputRules: [
            { condition: 'selectable = true', inputs: ['selectableType'] },
            { condition: 'selectable = true && selectableType = singleRow', inputs: ['selectFirstItem', 'highlightOnHover', 'highlightSelectedRow'] }
        ]
    },
    '0': {
        ReactComp: Table_v0_3_0,
        inputs: {
            ...reactPorts.Margins, columns, tableData, loading, shadow, fontSize, borderRadius, verticalSpacing, withBorder, withColumnBorders,
            widthString, heightString, minHeight, noHeader, singleRowSelectable, highlightOnHover, highlightSelectedRow, selectFirstItem,
            resetSingleSelected, resetMultipleSelected, striped, multipleRowSelectable
        },
        outputs: { selectedItem, selectedItems, selected, doDelete },
        inputsToCheck: ['columns'],
        inputRules: [
            { condition: 'singleRowSelectable = true', inputs: ['selectFirstItem', 'highlightOnHover', 'highlightSelectedRow'] },
        ]
    },
}

const TableNodes = getReactNodes(nodeName, nodeVersions)

export default TableNodes