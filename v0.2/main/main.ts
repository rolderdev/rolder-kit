import { NodeDefinitionInstance, ReactNode, defineModule } from '@noodl/noodl-sdk'
import rNodes from '../utils/noodl/v0.2.0/reactNodes'
import jsNodes from '../utils/noodl/v0.2.0/jsNodes'
import { getReactNode, getJsNode } from '../utils/noodl/v0.2.0/getNode'

import loadLibs from './loadLibs_v0.1.0'
loadLibs()

const reactNodes: ReactNode[] = Object.keys(rNodes).map(nodeName => Object.keys(rNodes[nodeName]).map(version => getReactNode(nodeName, version))).flat()
const nodes: NodeDefinitionInstance[] = Object.keys(jsNodes).map(nodeName => Object.keys(jsNodes[nodeName]).map(version => getJsNode(nodeName, version))).flat()

defineModule({
    reactNodes,
    nodes,
    settings: [
        { name: 'envVersion', type: 'string', displayName: 'Environment version', group: 'Connection', tooltip: "Examples: d2, s2, p3", },
        { name: 'project', type: 'string', displayName: 'Project name', group: 'Connection', tooltip: "Examples: rasko, tex" },
        { name: 'dbVersion', type: 'number', displayName: 'Database version', group: 'Connection', default: 1 },
        { name: 'sessionTimeout', type: 'string', displayName: 'Session timeout', group: 'Auth', tooltip: "milliseconds lib format: 1m, 3d", default: '7d' },
    ]
})