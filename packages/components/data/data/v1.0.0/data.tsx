import { Suspense, forwardRef, lazy, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import { Kuzzle, WebSocket } from 'kuzzle-sdk';
import type { MutationFnProps, Props } from './types';
import { PersistQueryClientProvider, type PersistedClient, type Persister } from '@tanstack/react-query-persist-client';
import { get, set, del } from 'idb-keyval';
import { getKuzzle } from '@packages/get-kuzzle';
import { onlineManager } from '@tanstack/react-query';
import { sendOutput } from '@packages/port-send';
import { useInterval } from '@mantine/hooks';
import useNetworkState from './src/useNetworkState';
import systemLoaderAnimation from '@packages/system-loader-animation';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			refetchOnMount: 'always',
		},
		mutations: {
			cacheTime: 1000 * 60 * 60 * 72,
			retry: 5,
		},
	},
});

queryClient.setMutationDefaults([], {
	mutationFn: async (props: MutationFnProps) => {
		const K = await getKuzzle();
		if (!K) return;

		const { dbName } = R.env;
		if (!dbName) {
			R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`);
			log.error('No dbName', R.env);
			return;
		}

		const r = await K.query({ controller: 'rolder', action: props.action, dbName, scheme: props.scheme, silent: props.silent });
		const data = r.result;
		const dataEntries = Object.entries(data);
		if (dataEntries.some((i) => i[1].error)) {
			dataEntries.forEach((entry) => {
				if (entry[1]?.error) {
					R.libs.mantine?.MantineError('Системная ошибка!', `${props.action} error at "${entry[0]}": ${entry[1]?.error}`);
					log.error(`${props.action} error at "${entry[0]}": ${entry[1]?.error}`);
				}
			});
		}

		return data;
	},
});

export function createIDBPersister(idbValidKey: IDBValidKey = 'reactQuery') {
	return {
		persistClient: async (client: PersistedClient) => {
			set(idbValidKey, client);
		},
		restoreClient: async () => {
			return await get<PersistedClient>(idbValidKey);
		},
		removeClient: async () => {
			await del(idbValidKey);
		},
	} as Persister;
}

const ReactQueryDevtoolsProduction = lazy(() =>
	//@ts-ignore
	import('@tanstack/react-query-devtools/production').then((d) => ({
		default: d.ReactQueryDevtools,
	}))
);

function Mutation(props: any) {
	const mutation = useMutation([]);

	//@ts-ignore
	R.libs.mutate = mutation.mutateAsync;

	return <>{props.children}</>;
}

export default forwardRef(function (props: Props) {
	const {
		backendVersion,
		dbName,
		persistData,
		backendDevMode,
		backendUrl,
		backendPort,
		detectOffline,
		measureTimeout,
		offlineLatancy,
		offlineJitter,
		offlineDownload,
	} = props;
	const { project, stopLoaderAnimationOn = 'authInitialized' } = Noodl.getProjectSettings();

	R.env.backendVersion = backendVersion;
	R.env.environment = backendVersion; //обратная совместимость
	R.env.dbName = dbName;
	R.libs.queryClient = queryClient;

	const [initState, setInitState] = useState<typeof R.states.backend>(R.states.backend);
	const { isOnline, measureNetwork } = useNetworkState(
		props.noodlNode,
		offlineLatancy || 2000,
		offlineJitter || 100,
		offlineDownload || 10000
	);
	const measureConnectionInterval = useInterval(() => measureNetwork(), measureTimeout || 2000);

	useEffect(() => {
		if (initState === 'notInitialized' && !detectOffline) {
			//@ts-ignore
			sendOutput(props.noodlNode, 'isOnline', onlineManager.isOnline());
			R.states.backend = 'initializing';
			setInitState('initializing');
		}

		if (initState === 'notInitialized' && detectOffline) {
			// disable React-Query online events
			onlineManager.setEventListener(() => () => {});

			//@ts-ignore
			sendOutput(props.noodlNode, 'isOnline', isOnline);
			//setOnlineState(props.noodlNode, pingTimeout)
			//            setTimeout(() => {
			R.states.backend = 'initializing';
			setInitState('initializing');
			//          }, pingTimeout)
		}

		if (initState === 'initialized' && detectOffline) measureConnectionInterval.start();
		if (initState === 'initialized' && stopLoaderAnimationOn === 'authInitialized') systemLoaderAnimation.stop();
	}, [detectOffline, initState]);

	useEffect(() => {
		if (!project || !backendVersion) {
			log.error('Kuzzle init: empty required props', { project, backendVersion });
			return;
		}

		if (!R.libs.Kuzzle) {
			if (initState === 'initializing') {
				const startTime = log.start();

				const kuzzle = new Kuzzle(
					new WebSocket(backendDevMode ? backendUrl || 'localhost' : `${project}.kuzzle.${backendVersion}.rolder.app`, {
						port: backendDevMode ? backendPort || 7512 : 443,
					})
				);
				if (detectOffline) kuzzle.autoReconnect = false;
				R.libs.Kuzzle = kuzzle;

				if (!detectOffline && onlineManager.isOnline()) {
					kuzzle.connect().then(() => {
						R.states.backend = 'initialized';
						setInitState('initialized');

						log.end('Kuzzle online init', startTime);
						log.info('R', R);
					});
				} else {
					R.states.backend = 'initialized';
					setInitState('initialized');

					log.end('Kuzzle offline init', startTime);
					log.info('R', R);
				}
			}
		}
	}, [project, backendVersion, initState]);

	return persistData ? (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{
				persister: createIDBPersister(),
				maxAge: 1000 * 60 * 60 * 72,
				buster: R.env.projectVersion,
			}}
			onSuccess={() => {
				if (R.libs.Kuzzle?.authenticated) queryClient.resumePausedMutations();
			}}
		>
			{initState === 'initialized' ? <Mutation>{props.children}</Mutation> : null}
			{R.states.debug ? (
				<Suspense fallback={null}>
					<ReactQueryDevtoolsProduction />
				</Suspense>
			) : null}
		</PersistQueryClientProvider>
	) : (
		<QueryClientProvider client={queryClient}>
			{initState === 'initialized' ? <Mutation>{props.children}</Mutation> : null}
			{R.states.debug ? (
				<Suspense fallback={null}>
					<ReactQueryDevtoolsProduction />
				</Suspense>
			) : null}
		</QueryClientProvider>
	);
});
