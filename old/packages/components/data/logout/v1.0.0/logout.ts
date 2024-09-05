import { getKuzzle } from '@packages/get-kuzzle';

export default {
	async logout() {
		const K = await getKuzzle();
		if (!K) {
			return;
		}

		K.auth.logout().then(() => window.location.replace(window.location.origin));
		return;
	},
};
