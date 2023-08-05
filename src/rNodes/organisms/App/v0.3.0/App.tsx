import { Notifications } from '@mantine/notifications'
import { useColorScheme, useWindowEvent } from '@mantine/hooks'
import { MantineProvider } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import ErrorHandler from '../../../../libs/errorHandler/v0.1.0/ErrorHandler'
import jwtRefresh from '../../../../libs/validateJwt/v0.1.0/validateJwt'

import { QueryClientProvider, QueryClient, QueryCache } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/build/lib/index.prod.js'

const queryClient = new QueryClient({
	queryCache: new QueryCache({ onError: (error: any, query) => { if (query.state.data !== undefined) ErrorHandler({ title: 'Системная ошибка!', message: error.message }) }, }),
})
window.QueryClient = queryClient

const Noodl = window.Noodl

export default function App_v0_3_0(props: any) {
	const urlParams = new URLSearchParams(window.location.search)
	const debug = parseInt(urlParams.get('debug') || '0')

	if (!window.Rolder?.inited) {
		const { envVersion, project, dbVersion = 1, sessionTimeout = '7d', projectVersion } = Noodl.getProjectSettings()
		window.Rolder = { inited: true, project, projectVersion, envVersion, dbVersion, dbClasses: props.dbClasses[0], debug, sessionTimeout }
		props.inited()
		if (debug > 1) console.log('Rolder:', window.Rolder)
	}

	useWindowEvent('focus', () => jwtRefresh().then((jwtValid) => !jwtValid && props.jwtValidationFailed()));

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


