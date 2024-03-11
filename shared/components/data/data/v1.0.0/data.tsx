import { forwardRef, useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import { Kuzzle, WebSocket } from 'kuzzle-sdk'
import { Props } from "./types"
import { Loader } from "@mantine/core"
import { sendOutput } from "@shared/port-send"
import { Network } from "@capacitor/network"
import { PersistQueryClientProvider, PersistedClient, Persister } from '@tanstack/react-query-persist-client'
import { get, set, del } from "idb-keyval";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: "always",
            refetchOnMount: "always"
        },
    },
})

export function createIDBPersister(idbValidKey: IDBValidKey = "reactQuery") {
    return {
        persistClient: async (client: PersistedClient) => {
            set(idbValidKey, client);
        },
        restoreClient: async () => {
            return await get<PersistedClient>(idbValidKey);
        },
        removeClient: async () => {
            await del(idbValidKey);
        },
    } as Persister;
}

const ReactQueryDevtoolsProduction = React.lazy(() =>
    import('@tanstack/react-query-devtools/production').then((d) => ({
        default: d.ReactQueryDevtools,
    })),
)

export default forwardRef(function (props: Props) {
    const { backendVersion, dbName, persistData, backendDevMode, backendUrl, backendPort } = props
    const { project } = Noodl.getProjectSettings()

    R.env.backendVersion = backendVersion
    R.env.dbName = dbName
    R.libs.queryClient = queryClient

    const [backendInited, setBackendInited] = useState(false)
    const [online, setOnline] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        Network.getStatus().then(state => {
            R.states.online = state.connected
            setOnline(state.connected)
            //@ts-ignore
            sendOutput(props.noodlNode, 'isOnline', state.connected)
        })

        Network.addListener('networkStatusChange', async state => {
            R.states.online = state.connected
            setOnline(state.connected)
            //@ts-ignore
            sendOutput(props.noodlNode, 'isOnline', state.connected)
            log.info('Network status changed', state)
        })

        return () => { Network.removeAllListeners() }
    }, [])

    useEffect(() => {
        if (!R.libs.Kuzzle && online !== undefined) {
            if (project && backendVersion) {
                const startTime = log.start()

                const kuzzle = new Kuzzle(
                    new WebSocket(
                        backendDevMode
                            ? backendUrl
                            : `${project}.kuzzle.${backendVersion}.rolder.app`,
                        { port: backendDevMode ? backendPort : 443 }
                    )
                )

                if (online) {
                    kuzzle.connect().then(async () => {
                        R.libs.Kuzzle = kuzzle

                        setBackendInited(true)

                        log.end('Kuzzle online init', startTime)
                        log.info('R', R)
                    })
                } else {
                    R.libs.Kuzzle = kuzzle

                    setBackendInited(true)

                    log.end('Kuzzle offline init', startTime)
                    log.info('R', R)
                }

                let reconnectTime = 0
                kuzzle.on('disconnected', (...args: any) => {
                    reconnectTime = log.start()
                    log.info('Kuzzle disconnected', args)
                })
                kuzzle.on('reconnected', () => { log.end('Kuzzle reconnected', reconnectTime) })

            } else log.error('Kuzzle init: empty required props', { project, backendVersion })
        }
    }, [project, backendVersion, online])

    return persistData ?
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister: createIDBPersister(),
                maxAge: 1000 * 60 * 60 * 24,
                buster: R.env.projectVersion,
            }}
        >
            {backendInited
                ? props.children
                : <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-28px', marginLeft: '-28px' }}>
                    <Loader color="dark" size='xl' />
                </div>}
            {R.states.debug && <React.Suspense fallback={null}>
                <ReactQueryDevtoolsProduction />
            </React.Suspense>}
        </PersistQueryClientProvider>
        : <QueryClientProvider
            client={queryClient}
        >
            {backendInited
                ? props.children
                : <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-28px', marginLeft: '-28px' }}>
                    <Loader color="dark" size='xl' />
                </div>}
            {R.states.debug && <React.Suspense fallback={null}>
                <ReactQueryDevtoolsProduction />
            </React.Suspense>}
        </QueryClientProvider>
})