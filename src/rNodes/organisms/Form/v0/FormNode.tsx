const nodeName = 'Form'
const nodeVersion = 'v0'
import { Comps, compVersions } from "./FormComps"
import { getReactNode } from "../../../../main/getNodes/v0.2.0/getNode"

export default getReactNode({ nodeName, nodeVersion, Comps, compVersions })