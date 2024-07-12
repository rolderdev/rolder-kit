import { getKuzzle } from '@packages/get-kuzzle';
import type { NoodlNode } from '@packages/node';
import { sendOutput, sendSignal } from '@packages/port-send';
import fetchUserAndSystemCreds from './fetchUserAndSystemCreds';

export default async function (noodlNode: NoodlNode, sessionTimeout: string, username?: string, password?: string) {
	if (!username || !password) {
		log.error('Username or password cannot by empty');
		return;
	}

	const K = await getKuzzle();
	if (!K) {
		R.libs.mantine?.MantineError?.('Ошибка авторизации!', 'Нет подключения к серверу', 5000);
		return;
	}

	const startTime = log.start();
	try {
		const token = await K.auth.login('local', { username, password }, sessionTimeout);
		await R.db?.states.auth.set('token', () => token);
		await fetchUserAndSystemCreds();
		await R.db?.states.auth.set('state', () => 'signedIn');
	} catch (e: any) {
		let errorMessage = 'Неизвестная ошибка';

		switch (e.code) {
			case 67305492:
				errorMessage = 'Неверный логин или пароль';
				break;
			case 33685517:
				errorMessage = 'Слишком много неуспешных попыток';
				break;
			default:
				log.error('Sign in failed', e);
				break;
		}

		R.libs.mantine?.MantineError?.('Ошибка авторизации!', errorMessage, 2000);
		sendOutput(noodlNode, 'error', errorMessage);
		sendSignal(noodlNode, 'signInFailed');
		return;
	}

	log.end('Sign in', startTime);

	return;
}
