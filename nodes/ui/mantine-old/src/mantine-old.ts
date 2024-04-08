//import { jsNodeStore } from './src/nodes/jsNodesStore'
import { rNodesStore } from './nodes/rNodesStore'
//@ts-ignore
//import { defineNode } from '@noodl/noodl-sdk'

//@ts-ignore
Noodl.defineModule({
    reactNodes: rNodesStore,
    //@ts-ignore
    //nodes: jsNodeStore.map(i => defineNode(i)),
})