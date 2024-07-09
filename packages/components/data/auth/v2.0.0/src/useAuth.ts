import { useInterval } from '@mantine/hooks';
import type { NoodlNode } from '@packages/node';
import { sendOutput, sendSignal } from '@packages/port-send';
import ms from 'ms';
import { useEffect, useState } from 'react';
import vaildateRefreshToken from './vaildateRefreshToken';
import systemLoaderAnimation from '@packages/system-loader-animation';
import fetchUserAndSystemCreds from './fetchUserAndSystemCreds';

type AuthStoreState = 'restoring' | 'signedIn' | 'stored' | 'signedOut';

export default function (noodlNode: NoodlNode, sessionTimeout: string) {
	const { stopLoaderAnimationOn = 'authInitialized' } = Noodl.getProjectSettings();

	const [signedIn, setSignedIn] = useState<boolean | undefined>();

	useEffect(() => {
		if (signedIn === true) {
			sendOutput(noodlNode, 'userRole', R.user?.user?.role?.value || null);
			sendSignal(noodlNode, 'signedIn');

			// must start with wait 1000 after Kuzzle.auth.login - https://docs.kuzzle.io/sdk/js/7/controllers/auth/refresh-token/#usage
			refreshTokenInterval.start();
		} else if (signedIn === false) {
			refreshTokenInterval.stop();
			sendOutput(noodlNode, 'userRole', null);
			sendSignal(noodlNode, 'signedOut');
		}
	}, [signedIn]);

	useEffect(() => {
		R.db?.addState('auth').then(async (auth) => {
			const stateStore = auth.state$;

			// triggers on state change and first load from storage
			stateStore.subscribe(async (state: AuthStoreState) => {
				switch (state) {
					case 'signedIn':
						{
							setSignedIn(true);
							auth.set('state', () => 'stored');
							if (stopLoaderAnimationOn === 'authInitialized') systemLoaderAnimation.stop();
							// Добавим в Sentry контекст пользователя
							Sentry?.setContext('user', R.user);
							Sentry?.setUser({ id: R.user?.id, name: R.user?.user?.id });

							HyperDX?.setGlobalAttributes({
								userId: R.user?.id,
								userData: JSON.stringify(R.user),
							});

							log.info('Signed in');
						}
						break;
					case 'stored':
						{
							if (auth.token && R.libs.Kuzzle && !R.libs.Kuzzle.jwt) auth.set('state', () => 'restoring');
						}
						break;
					case 'restoring':
						{
							if (R.libs.Kuzzle) R.libs.Kuzzle.jwt = auth.token;

							const refreshed = await vaildateRefreshToken(sessionTimeout);
							if (refreshed) {
								await fetchUserAndSystemCreds();

								log.info('Token restored');
								auth.set('state', () => 'signedIn');
							} else {
								log.info('Token refresh failed, sign out');
								auth.set('state', () => 'signedOut');
							}
						}
						break;
					case 'signedOut':
						{
							auth.set('token', () => undefined);
							setSignedIn(false);
							systemLoaderAnimation.stop(); // Выключаем лоадер при любой настройке, если не авторизован
							log.info('Signed out');
						}
						break;
					default:
						log.info('No stored token, sign out');
						auth.set('state', () => 'signedOut');
				}
			});
		});

		// from logout node
		Noodl.Events.on('signOut', () => R.db?.states.auth.set('signedIn', () => false));
	}, []);

	const refreshTokenInterval = useInterval(async () => vaildateRefreshToken(sessionTimeout), ms('10m'));

	return { signedIn };
}
