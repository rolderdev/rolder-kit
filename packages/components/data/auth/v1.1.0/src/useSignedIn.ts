import { useInterval } from '@mantine/hooks';
import type { NoodlNode } from '@packages/node';
import { sendOutput, sendSignal } from '@packages/port-send';
import ms from 'ms';
import { useEffect, useState } from 'react';
import refreshToken from './refreshToken';
import signIn from './signIn';
import { prepData } from '@packages/prep-data';
import { getKuzzle } from '@packages/get-kuzzle';

export default function (noodlNode: NoodlNode, sessionTimeout: string) {
	const [signedIn, setSignedIn] = useState(false);

	useEffect(() => {
		R.db?.addState('auth').then(async (auth) => {
			const signedInState = auth.signedIn$;

			signedInState.subscribe(async (signedIn: boolean) => {
				if (signedIn) {
					await refreshToken(sessionTimeout);
					refreshTokenInterval.start();
					const user = await prepData();
					sendOutput(noodlNode, 'userRole', user?.user?.role?.value || null);
					sendSignal(noodlNode, 'signedIn');
					setSignedIn(true);
				} else {
					refreshTokenInterval.stop();
					sendOutput(noodlNode, 'userRole', null);
					sendSignal(noodlNode, 'signedOut');
					setSignedIn(false);
				}
			});
		});

		Noodl.Events.on('signOut', () => R.db?.states.auth.set('signedIn', () => false));

		getKuzzle().then((K) => {
			if (K)
				K.on('tokenExpired', () => {
					R.db?.states.auth.set('signedIn', () => false);
					log.info('Kuzzle: token expired');
				});
		});
	}, []);

	const refreshTokenInterval = useInterval(async () => refreshToken(sessionTimeout), ms('1h'));

	return { signedIn, signIn };
}
