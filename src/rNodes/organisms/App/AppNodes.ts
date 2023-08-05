import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import App_v0_3_0 from "./v0.3.0/App"

const { dbClasses } = reactPorts.Data
const { notificationsPosition } = reactPorts.Params
const { detectColorScheme, colorScheme } = reactPorts.Style
const { inited, jwtValidationFailed } = reactPorts.Signals

const nodeName = 'App'
const nodeVersions: RNode = {
    '0.3.0': {
        ReactComp: App_v0_3_0,
        allowChildren: true,
        inputs: { dbClasses, detectColorScheme, colorScheme, notificationsPosition },
        outputs: { inited, jwtValidationFailed },
        inputsToCheck: ['dbClasses']
    }
}

const AppNodes = getReactNodes(nodeName, nodeVersions)

export default AppNodes