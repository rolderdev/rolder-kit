import loadLibs from './loadLibs_v0.1.0'
loadLibs()
import ErrorHandler from '../../../libs/error-handler/v0.0.1/ErrorHandler'

import { Notifications } from '@mantine/notifications'
import { useColorScheme } from '@mantine/hooks'
import { MantineProvider } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'

import { QueryClientProvider, QueryClient, QueryCache } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/build/lib/index.prod.js'
const queryClient = new QueryClient({
    queryCache: new QueryCache({ onError: (error, query) => { if (query.state.data !== undefined) ErrorHandler({ title: 'Системная ошибка!', message: error.message }) }, }),
})
window.queryClient = queryClient

export default function App_v0_2_0(props) {
    const urlParams = new URLSearchParams(window.location.search)
    const debug = parseInt(urlParams.get('debug') || '0')

    if (!window.Rolder?.inited) {
        const { backendType = 'kuzzle', envVersion, project, dbVersion = 1, sessionTimeout = '1d', classes: cls } = Noodl.getProjectSettings()
        cls = cls && JSON.parse(cls)
        window.Rolder = { inited: true, project, envVersion, backendType, dbVersion, classes: cls, debug, sessionTimeout }
        props.sendInited()
        if (debug > 1) console.log('Rolder:', window.Rolder)
    }

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
            }
            }
        >
            <DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1 }}>
                <Notifications position={notificationsPosition} />
                <QueryClientProvider client={queryClient}>
                    {props.children}
                    {debug > 0 && <ReactQueryDevtools />}
                </QueryClientProvider>
            </DatesProvider>
        </MantineProvider >
    )
}