import { defineModule } from '@noodl/noodl-sdk'
import { getReactNode, getNode } from './utils/noodl/v0.1.0/get-node'
import { reactNodes, nodes } from './utils/noodl/v0.1.0/nodes'

const jsNodes = Object.keys(nodes).map(nodeName => nodes[nodeName].versions.map(version => getNode(nodeName, version))).flat()
const rNodes = Object.keys(reactNodes).map(nodeName => Object.keys(reactNodes[nodeName].versions).map(version => getReactNode(nodeName, version))).flat()

defineModule({
    name: 'rolder-kit',
    nodes: jsNodes,
    reactNodes: rNodes,
    settings: [
        {
            name: 'backendType',
            type: {
                name: 'enum',
                enums: [{
                    value: 'parse',
                    label: 'Parse'
                }, {
                    value: 'kuzzle',
                    label: 'Kuzzle'
                }]
            },
            displayName: 'Backend',
            group: 'Connection',
            default: 'kuzzle',
        },
        { name: 'envVersion', type: 'string', displayName: 'Environment version', group: 'Connection', tooltip: "Examples: d2, s2, p3", },
        { name: 'project', type: 'string', displayName: 'Project name', group: 'Connection', tooltip: "Examples: rasko, tex" },
        { name: 'dbVersion', type: 'number', displayName: 'Database version', group: 'Connection', default: 1 },
        { name: 'classes', type: { name: 'string', codeeditor: 'json' }, displayName: 'Classes', group: 'Connection', tooltip: "Examples: [{product: {version: 1}}]" },
        { name: 'sessionTimeout', type: 'string', displayName: 'Session timeout', group: 'Auth', tooltip: "milliseconds lib format: 1m, 3d" },
    ]
})