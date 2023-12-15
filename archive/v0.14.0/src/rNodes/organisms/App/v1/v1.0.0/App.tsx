import { Notifications } from '@mantine/notifications'
import { useColorScheme, useShallowEffect, useWindowEvent } from '@mantine/hooks'
import { MantineProvider } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { QueryClientProvider, QueryClient, QueryCache } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/build/lib/index.prod.js'
import ErrorHandler from '../../../../../libs/errorHandler/v0.1.0/ErrorHandler'
import { forwardRef } from 'react'
import pJson from '../../../../../package.json'
import conLog from '../../../../../utils/debug/conLog/v0.1.0/conLog'
import { sendSignal } from '../../../../../main/ports/send/v0.3.0/send'
import validateJwt from '../../../../../libs/dataService/2_back/auth/v0.2.0/validateJwt'

const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error: any, query) => {
			if (query.state.data !== undefined) ErrorHandler({ title: 'Системная ошибка!', message: error.message })
		},
	}),
})
window.QueryClient = queryClient

const Comp = forwardRef(function (props: any) {
	const urlParams = new URLSearchParams(window.location.search)
	const debug = parseInt(urlParams.get('debug') || '0')

	useShallowEffect(() => {
		if (props.node && !window.Rolder?.inited) {
			const {
				envVersion,
				project,
				dbVersion = 1,
				dbClasses,
				sessionTimeout = '7d',
				projectVersion,
				defaultDateFormat = 'YYYY-MM-DD'
			} = window.Noodl.getProjectSettings()
			window.Rolder = {
				inited: true,
				project,
				projectVersion,
				envVersion,
				dbVersion,
				dbClasses: eval(dbClasses)[0],
				debug,
				sessionTimeout,
				rolderKit: `v${pJson.version}`,
				defaults: {
					dateFormat: defaultDateFormat
				},
			}

			sendSignal(props.node, 'inited')
			conLog(['Rolder:', window.Rolder])
		}
	}, [props])

	// log Kuzzle
	if (window.Kuzzle) {
		window.Kuzzle.on('disconnected', (...args: any) => {
			conLog('Reconnect', 'time')
			conLog(['Kuzzle event: disconnected:', ...args])
		});
		window.Kuzzle.on('reconnected', () => {
			conLog('Reconnect', 'timeEnd')
			conLog(['Kuzzle event: reconnected'])
		});
		window.Kuzzle.on('tokenExpired', () => {
			sendSignal(props.node, 'jwtValidationFailed')
			conLog(['Kuzzle event: tokenExpired'])
		})
	}
	// refresh jwt on focus
	useWindowEvent('focus', () => validateJwt().then((jwtValid) => !jwtValid && sendSignal(props.node, 'jwtValidationFailed')))

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
			}}
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
})

export default Comp