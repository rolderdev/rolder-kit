import { getKuzzle } from '@packages/get-kuzzle';
import type { NoodlNode } from '@packages/node';
import { sendOutput, sendSignal } from '@packages/port-send';

export default async function signIn(noodlNode: NoodlNode, sessionTimeout: string, username?: string, password?: string) {
	if (!username || !password) {
		log.error('Username or password cannot by empty');
		return;
	}

	const K = await getKuzzle();
	if (!K) return;

	const startTime = log.start();
	try {
		const connected = R.db?.states.network.connected;
		if (connected) {
			await K.auth.login('local', { username, password }, sessionTimeout);
			await R.db?.states.auth.set('signedIn', () => true);
		} else {
			R.libs.mantine?.MantineError?.('Ошибка авторизации!', 'Нет подключения к сети', 5000);
		}
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
	}
	log.end('Sign in', startTime);
}
