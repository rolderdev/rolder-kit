import { getKuzzle } from '@packages/get-kuzzle';
import { format } from '@formkit/tempo';
import ms from 'ms';

export default async function (sessionTimeout: string) {
	const K = await getKuzzle();
	if (K) {
		try {
			const connected = R.db?.states.network.connected;
			if (connected) {
				const tokenValidation = await K.auth.refreshToken({ expiresIn: sessionTimeout });
				log.info('Token refreshed', {
					expiresAt: format(new Date(tokenValidation.expiresAt), { date: 'short', time: 'short' }),
					ttl: ms(tokenValidation.ttl)
				});
			}
		} catch (e) {
			log.error('Token refresh error', e);
		}
	}
}
