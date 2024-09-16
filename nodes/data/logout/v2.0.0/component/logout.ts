import type { JsComponent } from '@shared/node-v1.0.0';
import { getKuzzle } from '@shared/get-kuzzle';

export default {
	async logout() {
		const K = await getKuzzle();
		if (!K) {
			return;
		}

		await R.db.states.auth?.set('signedIn', () => false);
		if (R.libs.Kuzzle) R.libs.Kuzzle.jwt = undefined;
		return;
	},
} as JsComponent;
