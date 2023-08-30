const nodeName = 'Table'
const nodeVersion = 'v1'
import { Comps, compVersions } from "./TableComps"
import { getReactNode } from "../../../../main/getNodes/v0.2.0/getNode"

export default getReactNode({ nodeName, nodeVersion, Comps, compVersions })