import { useInterval } from '@mantine/hooks';
import type { NoodlNode } from '@packages/node';
import { sendOutput, sendSignal } from '@packages/port-send';
import ms from 'ms';
import { useEffect, useState } from 'react';
import vaildateRefreshToken from './vaildateRefreshToken';

type AuthStoreState = 'restoring' | 'signedIn' | 'stored' | 'signedOut';

export default function (noodlNode: NoodlNode, sessionTimeout: string) {
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
								R.params.creds = auth.creds;
								R.user = auth.user;
								R.dbClasses = auth.dbClasses;

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
							log.info('Signed out');
							auth.set('token', () => undefined);
							setSignedIn(false);
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
