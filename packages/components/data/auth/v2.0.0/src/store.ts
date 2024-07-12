import { store } from '@davstack/store';
import ms from 'ms';
import { sendOutput, sendSignal } from '@packages/port-send';
import type { NoodlNode } from '@packages/node';
import vaildateRefreshToken from './vaildateRefreshToken';
import handleInit from './handleInit';
import handleSignIn from './handleSignIn';
import systemLoaderAnimation from '@packages/system-loader-animation';
import fetchUserAndSystemCreds from './fetchUserAndSystemCreds';

export const authStore = store({
	noodlNode: {} as NoodlNode,
	signedIn: undefined as boolean | undefined,
	isLeader: false,
	sessionTimeout: '5d',
	refreshTokenIntervalId: undefined as any,
	inited: false, // Нужен, чтобы не тригерить проверку при первичном онлайн состоянии.
})
	.actions((store) => {
		// Восстанавливает сессию с проверкой токена по данным с диска.
		const init = async (noodlNode: NoodlNode, sessionTimeout: string) => {
			// Запишем нужные параметры для удоства.
			store.noodlNode.set(noodlNode);
			store.sessionTimeout.set(sessionTimeout);
			// Выделим инициализацию в отдельную функцию.
			handleInit(store as any);
			console.log('init action', store.get(), await R.db?.states.auth.get());
		};

		const signIn = async (username?: string, password?: string) => {
			sendOutput(store.noodlNode.get(), 'signingIn', true);
			const signedIn = await handleSignIn(store.noodlNode.get(), store.sessionTimeout.get(), username, password);
			if (signedIn) await fetchUserAndSystemCreds();
			store.signedIn.set(signedIn);
			sendOutput(store.noodlNode.get(), 'signingIn', false);
		};

		// Запускает обновление токена и сохраняет id setInterval для последующей остановки.
		const setRefreshTokenInterval = () => {
			const refreshTokenIntervalId = setInterval(async () => {
				if (R.db?.states.network.connected && authStore.isLeader.get()) {
					const token = await vaildateRefreshToken(store as any);
					if (!token) store.signedIn.set(false);
				}
			}, ms('10s'));
			store.refreshTokenIntervalId.set(refreshTokenIntervalId);
		};

		return { init, signIn, setRefreshTokenInterval };
	})
	.effects((store) => ({
		// Срабатывает при смене статуса авторищованности. Записывает новый статус на диск.
		// Запускает/останавливает обновление токена. Отправляет данные в порты.
		signedInChanged: () =>
			store.signedIn.onChange((signedIn) => {
				console.log('signedInChanged', signedIn);
				if (signedIn) {
					// Сохраним состояние на диске.
					R.db?.states.auth.set('signedIn', () => true);
					// Запустим обновление, если еще не запущено с перехвата лидерства.
					if (!store.refreshTokenIntervalId.get()) store.setRefreshTokenInterval();
					// Уберем анимацию загрузки, если указано в параметрах приложения.
					const { stopLoaderAnimationOn = 'authInitialized' } = Noodl.getProjectSettings();
					if (stopLoaderAnimationOn === 'authInitialized') systemLoaderAnimation.stop();
					// Отправим в порты сигнал и роль авторизованного пользователя.
					sendOutput(store.noodlNode.get(), 'userRole', R.user?.user?.role?.value || null);
					sendSignal(store.noodlNode.get(), 'signedIn');
				} else {
					R.db?.states.auth.set('signedIn', () => false);
					clearInterval(store.refreshTokenIntervalId.get());
					store.refreshTokenIntervalId.set(undefined);
					systemLoaderAnimation.stop(); // Выключаем лоадер при любой настройке, если не авторизован
					sendOutput(store.noodlNode.get(), 'userRole', null);
					sendSignal(store.noodlNode.get(), 'signedOut');
				}
			}),

		/* // Запускает обновление токена, когда текущая вкладка становится лидером.
		leaderChanged: () =>
			// Срабатывает когда лидерство перехвачено, но не срабатывает когда потеряно.
			// Поэтому при авторизованности просто запускаем обновление токена.
			store.isLeader.onChange(() => {
				console.log('leaderChanged');
				if (store.signedIn.get()) store.setRefreshTokenInterval();
			}), */
	}));

export type Store = typeof authStore;
