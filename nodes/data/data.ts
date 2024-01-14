/* const dataNode = reactNode('Data', {
    
}, { allowChildren: true }) */

//===================================================================
//@ts-ignore
import { defineNode } from '@noodl/noodl-sdk'

import fetchNode from '@nodes/fetch'

const nodes = [fetchNode]

window.Noodl.defineModule({ nodes: nodes.map(i => defineNode(i)) })