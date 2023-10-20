import { Center, Loader, MantineProvider } from "@mantine/core"
import { DatesProvider } from "@mantine/dates"
import { Notifications } from "@mantine/notifications"
import { forwardRef, useState } from "react"
import ErrorHandler from '../../../../../../libs/errorHandler/v0.2.0/ErrorHandler'
import { sendOutput } from '../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send'
import { log, time } from "../../../../../../../../utils/debug/log/v0.2.0/log"
import { useColorScheme, useShallowEffect, useWindowEvent } from "@mantine/hooks"
import validateJwt from "./validateJwt"

const { QueryCache, QueryClient, QueryClientProvider, ReactQueryDevtools } = window.QueryInit
const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error: any, query: any) => {
            if (query.state.data !== undefined) ErrorHandler('Системная ошибка!', error.message)
        },
    }),
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
        log('Rolder', window.R)

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
            time('Kuzzle init')
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
                        Kuzzle?.auth.getCurrentUser().then((r: any) => {
                            window.R.user = { ...r.content, id: r._id }
                            sendOutput(props.noodlNode, 'userRole', r.content.role?.value)
                        })
                    else sendOutput(props.noodlNode, 'userRole', 'notAuthenticated')

                    window.R.states.inited = true
                    setInited(true)
                    time('Kuzzle init', true)
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

    useWindowEvent('focus', () => validateJwt().then((jwtValid) =>
        !jwtValid && sendOutput(props.noodlNode, 'userRole', 'notAuthenticated')))

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
                    {debug > 0 && <ReactQueryDevtools />}
                </QueryClientProvider>
            </DatesProvider>
        </MantineProvider >
    )
})