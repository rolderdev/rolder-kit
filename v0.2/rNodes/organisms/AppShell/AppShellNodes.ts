import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import AppShell_v0_1_0 from "./v0.1.0/AppShell"

const { enableHeader, enableFooter, enableNavbar, navItems } = reactPorts.Params
const { w: { ...navbarWidth }, h: { ...headerHeight } } = reactPorts.Dimensions
navbarWidth.displayName = 'Navbar width'
headerHeight.displayName = 'Header height'
const { selectedPath } = reactPorts.Data
const { pathChanged } = reactPorts.Signals

const nodeName = 'AppShell'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: AppShell_v0_1_0,
        allowChildren: true,
        inputs: { enableHeader, enableFooter, enableNavbar, navItems, navbarWidth, headerHeight },
        outputs: { selectedPath, pathChanged },
        inputRules: [
            { condition: 'enableHeader = true', inputs: ['headerHeight'] },
            { condition: 'enableNavbar = true', inputs: ['navbarWidth'] },
        ]
    }
}

const AppShellNodes = getReactNodes(nodeName, nodeVersions)

export default AppShellNodes