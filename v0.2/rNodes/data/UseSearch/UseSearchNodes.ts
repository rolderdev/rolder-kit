import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import UseSearch_v0_1_0 from "./v0.1.0/UseSearch"
import UseSearch_v0_1_1 from "./v0.1.1/UseSearch"

const { dbClasses, searchString, foundedData } = reactPorts.Data
const { searchFields, options } = reactPorts.Params
const { loading, enabled } = reactPorts.States
const { loaded } = reactPorts.Signals

const nodeName = 'UseSearch'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: UseSearch_v0_1_0,
        inputs: { dbClasses, searchString, searchFields, options, enabled },
        outputs: { foundedData, loading, loaded },
        inputsToCheck: ['dbClasses', 'searchFields'],
    },
    '0.1.1': {
        ReactComp: UseSearch_v0_1_1,
        inputs: { dbClasses, searchString, searchFields, options, enabled },
        outputs: { foundedData, loading, loaded },
        inputsToCheck: ['dbClasses', 'searchFields'],
    }
}

const UseSearchNodes = getReactNodes(nodeName, nodeVersions)

export default UseSearchNodes