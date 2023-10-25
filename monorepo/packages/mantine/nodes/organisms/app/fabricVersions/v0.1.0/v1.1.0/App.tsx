import { Center, Loader, MantineProvider } from "@mantine/core"
import { DatesProvider } from "@mantine/dates"
import { Notifications } from "@mantine/notifications"
import { forwardRef, useEffect, useState } from "react"
import ErrorHandler from '../../../../../../utils/errorHandler/v0.2.0/ErrorHandler'
import { sendOutput } from '../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send'
import { log, time } from "../../../../../../../../utils/debug/log/v0.2.0/log"
import { useColorScheme, useInterval, useShallowEffect } from "@mantine/hooks"
import validateJwt from "../../../../../../utils/validateJwt/v0.3.0/validateJwt"
import { dbClassVersion, dbVersion as getDbVersion } from "../../../../../../../data/utils/getVersion/v0.3.0/getVersion"
import { QueryCache, QueryClient, QueryClientProvider, focusManager } from "@tanstack/react-query"

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
window.R.libs.queryClient = queryClient
// refetch on window visible, but dont trigger onFocus (does't work on mobile and too often)
focusManager.setEventListener((handleFocus: any) => {
    if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('visibilitychange', handleFocus, false)
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

    const [inited, setInited] = useState(false)
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
        !inited && log('Rolder', window.R)

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

        if (props.connectKuzzle && !inited) {
            time('App init')
            const Kuzzle = new window.KuzzleInit.Kuzzle(
                new window.KuzzleInit.WebSocket(`${project}.kuzzle.${envVersion}.rolder.app`, { port: 443 })
            )
            Kuzzle.connect().then(() => {
                window.R.libs.Kuzzle = Kuzzle
                /// old app compatibility ///
                window.Kuzzle = Kuzzle
                ///
                validateJwt().then((jwtValid) => {
                    if (jwtValid)
                        Kuzzle.auth.getCurrentUser().then(user => {
                            if (user._source.dbClass) Kuzzle.document.search(
                                getDbVersion(),
                                dbClassVersion(user._source.dbClass),
                                { query: { equals: { 'user.id': user._id } } },
                                { lang: 'koncorde' }
                            ).then(kRes => {
                                const kItem = kRes.hits.find(i => i._source.user?.id === user._id)
                                let rItem: any = { user: {} }
                                if (kItem) rItem = { ...kRes.hits[0]?._source, id: kRes.hits[0]?._id }
                                rItem.user = { ...user._source, id: user._id }
                                window.R.user = rItem
                                sendOutput(props.noodlNode, 'userRole', rItem.user.role?.value)
                                window.R.states.inited = true
                                setInited(true)
                            })
                            else {
                                sendOutput(props.noodlNode, 'userRole', user._source.role?.value)
                                window.R.states.inited = true
                                setInited(true)
                            }
                        })
                    else {
                        sendOutput(props.noodlNode, 'userRole', 'notAuthenticated')
                        window.R.states.inited = true
                        time('App init', true)
                        setInited(true)
                    }
                })

                //===================================================================

                Kuzzle.on('disconnected', (...args: any) => {
                    time('Reconnect')
                    log('Kuzzle disconnected:', args)
                });
                Kuzzle.on('reconnected', () => {
                    time('Reconnect', true)
                    log('Kuzzle reconnected')
                });
                Kuzzle.on('tokenExpired', () => {
                    sendOutput(props.noodlNode, 'userRole', 'notAuthenticated')
                    log('Token expired')
                })
            })
        } else if (!props.connectKuzzle) window.R.states.inited = true
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
                        window.R.states.inited
                            ? props.children
                            : <Center h='100%'><Loader size={props.appLoaderSize} color={props.loaderColor} /></Center>
                    }
                </QueryClientProvider>
            </DatesProvider>
        </MantineProvider >
    )
})