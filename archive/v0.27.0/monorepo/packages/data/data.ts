import { defineModule, defineNode } from '@noodl/noodl-sdk'
import jsNodesStore from './nodes/jsNodesStore'
import rNodesStore from './nodes/rNodesStore'

defineModule({ nodes: jsNodesStore.map(i => defineNode(i)), reactNodes: rNodesStore })