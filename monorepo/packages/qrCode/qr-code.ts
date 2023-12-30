import { defineModule, defineNode } from '@noodl/noodl-sdk'
import nodesStore from './nodes/nodesStore'

defineModule({ nodes: nodesStore.map(i => defineNode(i)) })