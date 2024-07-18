import { getKuzzle } from '@packages/get-kuzzle';

export default {
	async logout() {
		const K = await getKuzzle();
		if (!K) {
			return;
		}

		await R.db?.states.auth?.set('signedIn', () => false);
		return;
	},
};
