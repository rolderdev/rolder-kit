/* Обновляет токен. */

import { getKuzzle } from '@packages/get-kuzzle'
import ms from 'ms'

export default async function (sessionTimeout: string) {
	const K = await getKuzzle()
	let valid = false

	if (K) {
		try {
			const tokenValidation = await K.auth.refreshToken({ expiresIn: sessionTimeout })
			await R.db?.states.auth.set('token', () => tokenValidation.jwt)
			valid = true

			log.info('Token refreshed', {
				expiresAt: R.libs.dayjs?.(tokenValidation.expiresAt).format('YYYY.MM.DD HH:mm'),
				ttl: ms(tokenValidation.ttl),
			})
		} catch (e: any) {
			//if ([117506049, 117637121].includes(e.code)) token = ''; // Вот это было зачем не помню.
		}
	}

	return valid
}
