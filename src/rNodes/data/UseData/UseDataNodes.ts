import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import UseData_v0_2_0 from "./v0.2.0/UseData"

const { useDataType } = reactPorts.Params
const { dbClass, itemId, itemsIds } = reactPorts.Data
const { query, sorts, options } = reactPorts.Params
const { loading, enabled } = reactPorts.States
const { loaded } = reactPorts.Signals

const nodeName = 'UseData'
const nodeVersions: RNode = {
    '0.2.0': {
        ReactComp: UseData_v0_2_0,
        inputs: { useDataType, enabled, dbClass, query, sorts, options, itemId, itemsIds },
        outputs: { loading, loaded },
        inputsToCheck: ['dbClass', 'useDataType'],
        inputRules: [
            { condition: 'useDataType = fetch', inputs: ['query', 'sorts', 'options'] },
            { condition: 'useDataType = get', inputs: ['itemId'] },
            { condition: 'useDataType = mGet', inputs: ['itemsIds'] },
        ]
    }
}

const UseDataNodes = getReactNodes(nodeName, nodeVersions)

export default UseDataNodes