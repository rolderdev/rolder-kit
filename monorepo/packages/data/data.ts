import { Kuzzle, WebSocket } from 'kuzzle-sdk'
window.KuzzleInit = { Kuzzle, WebSocket }

import nodesStore from './nodes/nodesStore'
import { defineModule, defineNode } from '@noodl/noodl-sdk'
defineModule({ nodes: nodesStore.map(i => defineNode(i)) })