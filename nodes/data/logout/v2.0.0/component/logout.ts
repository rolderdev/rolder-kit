import { getKuzzle } from '@shared/get-kuzzle'
import type { JsComponent } from '@shared/node-v1.0.0'

export default {
	async logout() {
		const K = await getKuzzle()
		if (!K) {
			return
		}

		if (R.libs.Kuzzle) R.libs.Kuzzle.jwt = undefined
		await R.db.states.auth?.set('signedIn', () => false)
		return
	},
} as JsComponent
