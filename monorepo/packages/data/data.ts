import { Kuzzle, WebSocket } from 'kuzzle-sdk'
window.KuzzleInit = { Kuzzle, WebSocket }
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
window.QueryInit = { QueryCache, QueryClient, QueryClientProvider, ReactQueryDevtools }

import nodesStore from './nodes/nodesStore'
function handleNoodl() {
    window.setTimeout(function () {
        if (window.Noodl.defineModule && window.Noodl.defineNode)
            return window.Noodl.defineModule({ nodes: nodesStore.map(i => window.Noodl.defineNode(i)) })
        else handleNoodl()
    }, 10)
}
handleNoodl()