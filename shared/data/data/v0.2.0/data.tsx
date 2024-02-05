import { forwardRef, useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import { Kuzzle, WebSocket } from 'kuzzle-sdk'
import { Props } from "./types"
import { Loader } from "@mantine/core"

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
    const { project } = Noodl.getProjectSettings()

    R.env.backendVersion = backendVersion
    R.env.dbName = dbName
    R.libs.queryClient = queryClient

    const [backendInited, setBackendInited] = useState(false)

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

                kuzzle.connect().then(async () => {
                    R.libs.Kuzzle = kuzzle

                    Noodl.Events.emit("backendInited")
                    setBackendInited(true)

                    log.end('Kuzzle init', startTime)
                    log.info('R', R)
                })

                let reconnectTime = 0
                kuzzle.on('disconnected', (...args: any) => {
                    reconnectTime = log.start()
                    log.info('Kuzzle disconnected', args)
                })
                kuzzle.on('reconnected', () => {
                    log.end('Kuzzle reconnected', reconnectTime)
                })

            } else log.error('Kuzzle init: empty required props', { project, backendVersion })
        } else setBackendInited(true)
    }, [project, backendVersion])

    return <QueryClientProvider client={queryClient}>
        {backendInited
            ? props.children
            : <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-28px', marginLeft: '-28px' }}>
                <Loader color="dark" size='xl' />
            </div>}
    </QueryClientProvider>
})