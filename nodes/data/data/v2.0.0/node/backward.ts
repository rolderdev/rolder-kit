import { QueryClient, type UseMutateAsyncFunction } from '@tanstack/react-query';
import { getKuzzle } from '@shared/get-kuzzle-v0.2.0';
import type { Item } from '@shared/types-v0.1.0';

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

type MutationFnProps = {
	action: 'create' | 'update' | 'delete';
	scheme: {
		dbClass: string;
		items: Item[];
	}[];
	silent?: boolean;
};

export type QueryClientT = typeof queryClient;
export type Mutate = UseMutateAsyncFunction;

R.libs.queryClient = queryClient;
