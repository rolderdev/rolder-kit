/* Обновляет токен. */

import { getKuzzle } from '@shared/get-kuzzle-v0.2.0';
import ms from 'ms';

export default async function (expiresIn: string) {
	const K = await getKuzzle();
	let valid = false;

	if (K) {
		try {
			const tokenValidation = await K.auth.refreshToken({ expiresIn });
			K.jwt = tokenValidation.jwt;
			await R.db?.states.auth.set('token', () => tokenValidation.jwt);
			valid = true;

			log.info('Token refreshed', {
				expiresAt: R.libs.dayjs?.(tokenValidation.expiresAt).format('YYYY.MM.DD HH:mm'),
				ttl: ms(tokenValidation.ttl),
			});
		} catch (e) {
			// Сбросим при ошибке.
			K.jwt = undefined;
			await R.db.states.auth.set('token', () => undefined);
			await R.db.states.auth.set('user', () => undefined);
			await R.db.states.auth.set('signedIn', () => false);

			log.error('vaildateRefreshToken error', e);
		}
	}

	return valid;
}
