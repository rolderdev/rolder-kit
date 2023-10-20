import { Kuzzle, WebSocket } from 'kuzzle-sdk'
window.KuzzleInit = { Kuzzle, WebSocket }
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
window.QueryInit = { QueryCache, QueryClient, QueryClientProvider, ReactQueryDevtools }

import { defineModule, defineNode } from '../../node_modules/@noodl/noodl-sdk'

import nodesStore from './nodes/nodesStore'
defineModule({ nodes: nodesStore.map(i => defineNode(i)) })