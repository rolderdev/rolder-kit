/* Обновляет токен. Вовзращает новый токен или пустую строку. */

import { getKuzzle } from '@packages/get-kuzzle';
import ms from 'ms';
import type { Store } from './store';

export default async function (store: Store) {
	const K = await getKuzzle();
	let token = '';
	if (K) {
		try {
			// Проверим токен только если это не лидер. Иначе возьмем данные у лидера.
			if (store.isLeader.get()) {
				const tokenValidation = await K.auth.refreshToken({ expiresIn: store.sessionTimeout.get() });
				await R.db?.states.auth.set('token', () => tokenValidation.jwt);
				token = tokenValidation.jwt;

				console.log('vaildateRefreshToken', {
					expiresAt: R.libs.dayjs?.(tokenValidation.expiresAt).format('YYYY.MM.DD HH:mm'),
					ttl: ms(tokenValidation.ttl),
				});

				log.info('Token refreshed', {
					expiresAt: R.libs.dayjs?.(tokenValidation.expiresAt).format('YYYY.MM.DD HH:mm'),
					ttl: ms(tokenValidation.ttl),
				});
			} else {
				token = await R.db?.states.auth.get('token');
				console.log('vaildateRefreshToken', token);
			}
		} catch (e: any) {
			//if ([117506049, 117637121].includes(e.code)) token = ''; // Вот это было зачем не помню.
			console.log('catch vaildateRefreshToken');
		}
	}

	return token;
}
