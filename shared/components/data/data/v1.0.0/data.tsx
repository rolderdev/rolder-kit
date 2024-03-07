import { forwardRef, useEffect, useMemo, useState } from "react"
import { QueryClient, QueryClientProvider, onlineManager } from "@tanstack/react-query"
import React from "react"
import { Kuzzle, WebSocket } from 'kuzzle-sdk'
import { Props } from "./types"
import { Loader } from "@mantine/core"
import { sendOutput } from "@shared/port-send"
import { Network } from "@capacitor/network"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: "always",
            refetchOnMount: "always",
        },
    },
})

export default forwardRef(function (props: Props) {
    const { backendVersion, dbName, backendDevMode, backendUrl, backendPort } = props
    const { project, serviceWorker } = Noodl.getProjectSettings()

    R.env.backendVersion = backendVersion
    R.env.dbName = dbName
    R.libs.queryClient = queryClient

    useEffect(() => {
        R.states.online = onlineManager.isOnline()
        //@ts-ignore
        sendOutput(props.noodlNode, 'isOnline', onlineManager.isOnline())
        Network.addListener('networkStatusChange', status => {
            R.states.online = status.connected
            //@ts-ignore
            sendOutput(props.noodlNode, 'isOnline', status.connected)
            log.info('Network status changed', status)
        })
        return () => { Network.removeAllListeners() }
    }, [])

    const [backendInited, setBackendInited] = useState(false)

    Noodl.Events.on('backendInited', () => {
        setBackendInited(true)
    })

    useEffect(() => {
        if (!R.libs.Kuzzle) {
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

                if (onlineManager.isOnline()) {
                    kuzzle.connect().then(async () => {
                        R.libs.Kuzzle = kuzzle

                        if (!serviceWorker) {
                            Noodl.Events.emit("backendInited")
                            //setBackendInited(true)
                        } /* else if (R.states.serviceWorkerActivated) {
                            Noodl.Events.emit("backendInited")
                            //setBackendInited(true)
                        } */

                        log.end('Kuzzle online init', startTime)
                        log.info('R', R)
                    })
                } else {
                    R.libs.Kuzzle = kuzzle

                    Noodl.Events.emit("backendInited")
                    //setBackendInited(true)

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
        } else Noodl.Events.emit("backendInited")//setBackendInited(true)
    }, [project, backendVersion])

    return <QueryClientProvider client={queryClient}>
        {backendInited
            ? props.children
            : <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-28px', marginLeft: '-28px' }}>
                <Loader color="dark" size='xl' />
            </div>}
    </QueryClientProvider>
})