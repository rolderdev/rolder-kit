import { jsNodeStore } from './src/nodes/jsNodesStore'
import { rNodesStore } from './src/nodes/rNodesStore'

//===================================================================

window.Noodl.defineModule({
    reactNodes: rNodesStore,
    nodes: jsNodeStore.map(i => window.Noodl.defineNode(i)),
})