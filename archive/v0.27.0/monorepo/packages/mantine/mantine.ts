const urlParams = new URLSearchParams(window.location.search)
const debug = parseInt(urlParams.get('debug') || '0')
window.R.states = { debug }
import rKitJson from '../../package.json'
window.R.env = { rolderKit: `v${rKitJson.version}` }

//==============================================================

import { defineModule, defineNode } from '@noodl/noodl-sdk'

import jsNodesStore from './nodes/jsNodesStore'
import rNodesStore from './nodes/rNodesStore'

defineModule({
    nodes: jsNodesStore.map(i => defineNode(i)),
    reactNodes: rNodesStore,    
    settings: [
        { name: 'project', type: 'string', displayName: 'Project name', group: 'Project', tooltip: "Examples: rasko, tex" },
        { name: 'projectVersion', type: 'string', displayName: 'Project version', group: 'Project' }
    ]
})