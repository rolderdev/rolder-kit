import { forwardRef, useEffect, useState } from 'react';
import { Kuzzle, WebSocket } from 'kuzzle-sdk';
import { QueryClient, QueryClientProvider, useMutation, type UseMutateAsyncFunction } from '@tanstack/react-query';
import { getKuzzle } from '@shared/get-kuzzle-v0.2.0';
import systemLoaderAnimation from '@shared/system-loader-animation-v0.1.0';
import type { MutationFnProps, Props } from '../node/definition';
import setConfig from './setConfig';
import { sendSignal } from '@shared/port-send-v1.0.0';

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

export type QueryClientT = typeof queryClient;
export type Mutate = UseMutateAsyncFunction;

function Mutation(props: any) {
	const mutation = useMutation([]);

	R.libs.mutate = mutation.mutateAsync;

	return <>{props.children}</>;
}

export default forwardRef(function (props: Props) {
	const { dbName, backendDevMode, backendUrl, backendPort } = props;
	const { project, stopLoaderAnimationOn = 'authInitialized', environment = 'd2' } = Noodl.getProjectSettings();

	R.env.dbName = dbName;
	R.libs.queryClient = queryClient;

	const [initState, setInitState] = useState<typeof R.states.backend>(R.states.backend);

	useEffect(() => {
		if (initState === 'notInitialized') {
			R.states.backend = 'initializing';
			setInitState('initializing');
		}

		if (initState === 'initialized' && stopLoaderAnimationOn === 'authInitialized') systemLoaderAnimation.stop();
	}, [initState]);

	useEffect(() => {
		if (!project || !environment) {
			log.error('Kuzzle init: empty required props', { project, environment });
			return;
		}

		if (!R.libs.Kuzzle) {
			if (initState === 'initializing') {
				const startTime = log.start();

				const kuzzle = new Kuzzle(
					new WebSocket(backendDevMode ? backendUrl || 'localhost' : `${project}.kuzzle.${environment}.rolder.app`, {
						port: backendDevMode ? backendPort || 7512 : 443,
					})
				);

				R.libs.Kuzzle = kuzzle;

				if (R.db?.states.network.connected) {
					kuzzle.connect().then(async () => {
						const success = await setConfig(kuzzle, true);
						if (success) {
							R.states.backend = 'initialized';
							setInitState('initialized');
							sendSignal(props.noodlNode, 'initialized');
						}

						log.end('Kuzzle online init', startTime);
						log.info('R', R);
					});
				} else {
					setConfig(kuzzle, false).then((success) => {
						if (success) {
							R.states.backend = 'initialized';
							setInitState('initialized');
						}

						log.end('Kuzzle offline init', startTime);
						log.info('R', R);
					});
				}
			}
		}
	}, [project, environment, initState]);

	return (
		<QueryClientProvider client={queryClient}>
			{initState === 'initialized' ? <Mutation>{props.children}</Mutation> : null}
		</QueryClientProvider>
	);
});
