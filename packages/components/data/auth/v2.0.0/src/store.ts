import { store } from '@davstack/store';
import type { NoodlNode } from '@packages/node';
import { sendOutput, sendSignal } from '@packages/port-send';
import systemLoaderAnimation from '@packages/system-loader-animation';
import { getKuzzle } from '@packages/get-kuzzle';

export const authStore = store({
	noodlNode: {} as NoodlNode,
	isLeader: false,
	signedIn: undefined as boolean | undefined,
	sessionTimeout: '5d',
}).actions((store) => {
	/* Функция берет текущее состояние авторизации с диска, отправляет результат в порты и меняет состояние signedIn. */
	const handleAuth = async () => {
		const signedIn = R.db?.states.auth.signedIn;

		if (signedIn) {
			// Добавим информацию о пользователе в логи.
			Sentry?.setContext('user', R.user);
			Sentry?.setUser({ id: R.user?.id, name: R.user?.user?.id });

			HyperDX?.setGlobalAttributes({
				userId: R.user?.id,
				userData: JSON.stringify(R.user),
			});

			sendOutput(store.noodlNode.get(), 'userRole', R.user?.user?.role?.value || null);
			sendSignal(store.noodlNode.get(), 'signedIn');
			// Уберем анимацию загрузки, если указано в параметрах приложения.
			const { stopLoaderAnimationOn = 'authInitialized' } = Noodl.getProjectSettings();
			if (stopLoaderAnimationOn === 'authInitialized') systemLoaderAnimation.stop();
			store.signedIn.set(true);
		} else {
			sendOutput(store.noodlNode.get(), 'userRole', null);
			sendSignal(store.noodlNode.get(), 'signedOut');
			systemLoaderAnimation.stop(); // Выключаем лоадер при любой настройке, если не авторизован
			store.signedIn.set(false);
		}
	};

	const signIn = async (username?: string, password?: string) => {
		if (!username || !password) {
			log.error('Username or password cannot by empty');
			return false;
		}

		const K = await getKuzzle();
		if (!K) {
			R.libs.mantine?.MantineError?.('Ошибка авторизации!', 'Нет подключения к серверу', 5000);
			return false;
		}

		const startTime = log.start();
		try {
			const token = await K.auth.login('local', { username, password }, store.sessionTimeout.get());
			await R.db?.states.auth.set('token', () => token);
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
			return false;
		}

		log.end('Sign in', startTime);

		return true;
	};

	return { handleAuth, signIn };
});

export type Store = typeof authStore;
