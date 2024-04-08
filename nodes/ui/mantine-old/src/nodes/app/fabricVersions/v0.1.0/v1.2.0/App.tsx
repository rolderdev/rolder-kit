import { Center, Loader, MantineProvider } from "@mantine/core"
import { DatesProvider } from "@mantine/dates"
import { Notifications } from "@mantine/notifications"
import { forwardRef, useEffect, useState } from "react"
import ErrorHandler from '../../../../../utils/errorHandler/v0.2.0/ErrorHandler'
import { sendOutput } from '../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send'
import { useColorScheme, useInterval, useShallowEffect } from "@mantine/hooks"
import validateJwt, { jwtValidState } from "../../../../../utils/validateJwt/v0.3.0/validateJwt"
import { QueryCache, QueryClient, QueryClientProvider, focusManager } from "@tanstack/react-query"
import initKuzzle from "./initKuzzle"
import { log, time } from "../../../../../utils/debug/log/v0.2.0/log"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: "always",
            refetchOnMount: "always",
        },
    },
    queryCache: new QueryCache({
        onError: (error: any, query: any) => {
            if (query.state.data !== undefined) ErrorHandler('Системная ошибка!', error.message)
        },
    }),
})

// refetch on window visible if jwtValid, but dont trigger onFocus (does't work on mobile and too often)
focusManager.setEventListener((handleFocus: any) => {
    if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === "visible" && jwtValidState.get()) handleFocus()
        }, false)
    }
    return () => {
        window.removeEventListener('visibilitychange', handleFocus)
    }
})

/// old app compatibility
window.QueryClient = queryClient

export default forwardRef(function (props: any) {
    const { debug } = window.R.states
    const { cookies } = window.R.libs
    const {
        envVersion,
        project,
        dbVersion = 1,
        dbClasses,
        sessionTimeout = '7d',
        projectVersion,
        defaultDateFormat = 'YYYY-MM-DD'
    } = window.Noodl.getProjectSettings()

    //===================================================================

    const [initState, setInitState] = useState<'started' | 'initing' | 'finished'>('started')
    useShallowEffect(() => {
        if (projectVersion) {
            const cookieProjectVersion = cookies.get('projectVersion')
            if (!cookieProjectVersion) cookies.set('projectVersion', projectVersion)
            else if (projectVersion !== cookieProjectVersion) {
                cookies.set('projectVersion', projectVersion)
                window.location.reload()
            }
        }

        //===================================================================

        window.R.env.envVersion = envVersion
        window.R.env.project = project
        window.R.env.projectVersion = projectVersion
        window.R.env.dbVersion = dbVersion
        window.R.params.dbClasses = eval(dbClasses)[0]
        window.R.params.sessionTimeout = sessionTimeout
        window.R.params.defaults = { dateFormat: defaultDateFormat }

        /// old app compatibility
        window.Rolder = {
            project,
            projectVersion,
            envVersion,
            dbVersion,
            dbClasses: eval(dbClasses)[0],
            debug,
            sessionTimeout,
            defaults: {
                dateFormat: defaultDateFormat
            },
        }

        //===================================================================        
        if (props.connectKuzzle && initState === 'started') {
            setInitState('initing')
            time('Kuzzle init')
            initKuzzle(props.noodlNode).then(() => {
                setInitState('finished')
                log('Rolder', window.R)
                time('Kuzzle init', true)
            })
        } else if (!props.connectKuzzle) {
            setInitState('finished')
            log('Rolder', window.R)
        }
    }, [props])

    // jwt check
    const validateJwtInteval = useInterval(() => {
        validateJwt().then((jwtValid) => {
            if (!jwtValid) sendOutput(props.noodlNode, 'userRole', 'notAuthenticated')
        })
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

    //===================================================================

    const { notificationsPosition, detectColorScheme, colorScheme: cs } = props
    let colorScheme = useColorScheme()
    if (!detectColorScheme) colorScheme = cs

    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme,
                defaultRadius: 'md',
                globalStyles: (theme) => ({
                    body: {
                        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0],
                    }
                }),
            }}>
            <DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1 }}>
                <Notifications position={notificationsPosition} />
                <QueryClientProvider client={queryClient}>
                    {
                        initState === 'finished'
                            ? props.children
                            : <Center h='100%'><Loader size={props.appLoaderSize} color={props.loaderColor} /></Center>
                    }
                </QueryClientProvider>
            </DatesProvider>
        </MantineProvider >
    )
})