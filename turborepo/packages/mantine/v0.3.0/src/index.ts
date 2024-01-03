const urlParams = new URLSearchParams(window.location.search)
const debug = parseInt(urlParams.get('debug') || '0')
window.R.states = { debug }
import rKitJson from '../../../../package.json'
window.R.env = { rolderKit: `v${rKitJson.version}` }

//==============================================================

// @ts-ignore
import { defineModule, defineNode } from '@noodl/noodl-sdk'

import jsNodesStore from './nodes/jsNodesStore'
import rNodesStore from './nodes/rNodesStore'

defineModule({
    nodes: jsNodesStore.map(i => defineNode(i)),
    reactNodes: rNodesStore
})