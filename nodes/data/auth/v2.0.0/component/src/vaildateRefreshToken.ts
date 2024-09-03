/* Обновляет токен. */

import { getKuzzle } from '@shared/get-kuzzle-v0.2.0';
import ms from 'ms';

export default async function (sessionTimeout: string) {
	const K = await getKuzzle();
	let valid = false;

	if (K) {
		try {
			const tokenValidation = await K.auth.refreshToken({ expiresIn: sessionTimeout });
			console.log({
				expiresAt: R.libs.dayjs?.(tokenValidation.expiresAt).format('YYYY.MM.DD HH:mm'),
				ttl: ms(tokenValidation.ttl),
			});
			await R.db?.states.auth.set('token', () => tokenValidation.jwt);
			valid = true;

			log.info('Token refreshed', {
				expiresAt: R.libs.dayjs?.(tokenValidation.expiresAt).format('YYYY.MM.DD HH:mm'),
				ttl: ms(tokenValidation.ttl),
			});
		} catch (e) {
			log.error('vaildateRefreshToken error', e);
		}
	}

	return valid;
}
