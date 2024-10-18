import { Network } from '@capacitor/network'
import { getKuzzle } from '@packages/get-kuzzle'
import systemLoaderAnimation from '@packages/system-loader-animation'
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query'
import { Kuzzle, WebSocket } from 'kuzzle-sdk'
import { Suspense, forwardRef, lazy, useEffect, useState } from 'react'
import type { MutationFnProps, Props } from './types'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Number.POSITIVE_INFINITY,
			refetchOnMount: 'always',
		},
		mutations: {
			cacheTime: 1000 * 60 * 60 * 72,
			retry: 5,
		},
	},
})

queryClient.setMutationDefaults([], {
	mutationFn: async (props: MutationFnProps) => {
		const K = await getKuzzle()
		if (!K) return

		const { dbName } = R.env
		if (!dbName) {
			R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`)
			log.error('No dbName', R.env)
			return
		}

		const r = await K.query({ controller: 'rolder', action: props.action, dbName, scheme: props.scheme, silent: props.silent })
		const data = r.result
		const dataEntries = Object.entries(data)
		if (dataEntries.some((i) => i[1].error)) {
			dataEntries.forEach((entry) => {
				if (entry[1]?.error) {
					R.libs.mantine?.MantineError('Системная ошибка!', `${props.action} error at "${entry[0]}": ${entry[1]?.error}`)
					log.error(`${props.action} error at "${entry[0]}": ${entry[1]?.error}`)
				}
			})
		}

		return data
	},
})

const ReactQueryDevtoolsProduction = lazy(() =>
	//@ts-ignore
	import('@tanstack/react-query-devtools/production').then((d) => ({
		default: d.ReactQueryDevtools,
	}))
)

function Mutation(props: any) {
	const mutation = useMutation([])

	//@ts-ignore
	R.libs.mutate = mutation.mutateAsync

	return <>{props.children}</>
}

export default forwardRef((props: Props) => {
	const { dbName, backendDevMode, backendUrl, backendPort } = props
	const { project, stopLoaderAnimationOn = 'authInitialized', environment = 'd2' } = Noodl.getProjectSettings()

	R.env.dbName = dbName
	R.libs.queryClient = queryClient

	const [initState, setInitState] = useState<typeof R.states.backend>(R.states.backend)

	useEffect(() => {
		if (initState === 'notInitialized') {
			R.states.backend = 'initializing'
			setInitState('initializing')
		}

		if (initState === 'initialized' && stopLoaderAnimationOn === 'authInitialized') systemLoaderAnimation.stop()
	}, [initState])

	useEffect(() => {
		if (!project || !environment) {
			log.error('Kuzzle init: empty required props', { project, environment })
			return
		}

		if (!R.libs.Kuzzle) {
			if (initState === 'initializing') {
				const startTime = log.start()

				const kuzzle = new Kuzzle(
					new WebSocket(backendDevMode ? backendUrl || 'localhost' : `${project}.kuzzle.${environment}.rolder.app`, {
						port: backendDevMode ? backendPort || 7512 : 443,
					})
				)

				R.libs.Kuzzle = kuzzle

				Network.getStatus().then((state) => {
					if (state.connected) {
						kuzzle.connect().then(() => {
							R.states.backend = 'initialized'
							setInitState('initialized')

							log.end('Kuzzle online init', startTime)
							log.info('R', R)
						})
					} else {
						R.states.backend = 'initialized'
						setInitState('initialized')

						log.end('Kuzzle offline init', startTime)
						log.info('R', R)
					}
				})
			}
		}
	}, [project, environment, initState])

	return (
		<QueryClientProvider client={queryClient}>
			{initState === 'initialized' ? <Mutation>{props.children}</Mutation> : null}
			{R.states.debug ? (
				<Suspense fallback={null}>
					<ReactQueryDevtoolsProduction />
				</Suspense>
			) : null}
		</QueryClientProvider>
	)
})
