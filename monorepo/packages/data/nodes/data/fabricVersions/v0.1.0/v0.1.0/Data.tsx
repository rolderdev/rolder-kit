import { forwardRef, useEffect, useState } from "react"
import { log, time } from "../../../../../../../utils/debug/log/v0.2.0/log"
import { QueryClient, QueryClientProvider, focusManager } from "@tanstack/react-query"
import initKuzzle from "./initKuzzle"
import validateJwt, { jwtValidState } from "../../../../../../mantine/utils/validateJwt/v0.3.0/validateJwt"
import { sendOutput } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { useInterval } from "@mantine/hooks"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: "always",
            refetchOnMount: "always",
        },
    },
})

// refetch on window visible if jwtValid, but dont trigger onFocus (does't work on mobile and too often)
focusManager.setEventListener((handleFocus: any) => {
    if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('visibilitychange', async () => {
            if (document.visibilityState === "visible" && jwtValidState.get()) {
                await validateJwt()
                handleFocus()
            }
        }, false)
    }
    return () => {
        window.removeEventListener('visibilitychange', handleFocus)
    }
})

export default forwardRef(function (props: any) {
    const [backendInited, setBackendInited] = useState(false)

    window.R.libs.queryClient = queryClient

    useEffect(() => {
        const { backendVersion, dbName, sessionTimeout, projectDefaults } = props

        window.R.env.backendVersion = backendVersion
        window.R.env.dbName = dbName
        window.R.params.sessionTimeout = sessionTimeout
        window.R.params.defaults = projectDefaults

        time('Kuzzle init')
        initKuzzle(props.noodlNode).then(() => {
            window.Noodl.Events.emit("backendInited")
            setBackendInited(true)
            log('Rolder', window.R)
            time('Kuzzle init', true)
        })
    }, [props])

    // jwt check    
    const validateJwtInteval = useInterval(() => {
        validateJwt().then((jwtValid) => { if (!jwtValid) sendOutput(props.noodlNode, 'userRole', 'notAuthenticated') })
    }, 360000)
    useEffect(() => {
        validateJwtInteval.start();
        window.addEventListener(
            'visibilitychange',
            () => {
                if (document.visibilityState === "visible") validateJwt().then((jwtValid) => {
                    console.log('visibilitychange jwtValid', jwtValid)
                    if (!jwtValid) sendOutput(props.noodlNode, 'userRole', 'notAuthenticated')
                })
            }
        )
        return validateJwtInteval.stop;
    }, []);

    return <QueryClientProvider client={queryClient}>
        {backendInited && props.children}
    </QueryClientProvider>
})