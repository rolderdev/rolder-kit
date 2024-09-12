import '@shared/types-v0.1.0';

export type InitState = 'shared' | 'localDb' | 'network' | 'backend' | 'auth' | 'initialized';

export default async (state: InitState) => {
	return new Promise((resolve) => {
		const interval = setInterval(async () => {
			if (R.states.init.value === state) {
				clearInterval(interval);
				resolve(undefined);
			}
		}, 50);
	});
};
