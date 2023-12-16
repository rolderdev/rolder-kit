import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import ETable_v0_1_1 from "./v0.1.1/ETable"

const { tableData, foundedData, selectedItem, selectedItems } = reactPorts.Data
const { loading, searchEnabled } = reactPorts.States
const { doDelete, viewItem, editItem, viewImages } = reactPorts.Signals
const { tableScheme, filterMaps } = reactPorts.Params
const { verticalSpacing } = reactPorts.Layout
const { w: { ...width }, h: { ...height } } = reactPorts.Dimensions
const { widthString, heightString } = reactPorts.ControlledDimensions
const { minHeight, fontSize } = reactPorts.Sx
const { shadow, borderRadius, withBorder, withColumnBorders } = reactPorts.Style

const nodeName = 'ETable'
const nodeVersions: RNode = {
    '0.1.1': {
        ReactComp: ETable_v0_1_1,
        inputs: {
            ...reactPorts.Margins, tableScheme, tableData, filterMaps, foundedData, loading, shadow, fontSize, borderRadius, verticalSpacing, withBorder, withColumnBorders,
            width, widthString, height, heightString, minHeight, searchEnabled
        },
        outputs: { selectedItem, selectedItems, doDelete, viewItem, editItem, viewImages },
        inputsToCheck: ['tableScheme', 'filterMaps'],
    }
}

const ETableNodes = getReactNodes(nodeName, nodeVersions)

export default ETableNodes