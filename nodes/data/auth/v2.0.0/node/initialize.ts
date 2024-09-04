import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import setParams from './setParams';
import type { Props, Store } from '../node/definition';
import systemLoaderAnimation from '@shared/system-loader-animation-v0.1.0';
import { getKuzzle } from '@shared/get-kuzzle-v0.2.0';
import fetchUser from './fetchUser';
import ms from 'ms';
import vaildateRefreshToken from './vaildateRefreshToken';
import type { NoodlNode } from '@shared/node-v1.0.0';

export default async (p: Props, noodlNode: NoodlNode) => {
	// Создадим хранилище для сравнения параметров.
	p.store = { signedIn: undefined, isLeader: false, refreshInterval: undefined };

	// Возьмем состояние с диска. addState возвращает текущее состояние, если есть, иначе создает.
	// Делаем это вначале, чтобы далее использовать новое пустое или текущее состояние на диске.
	const persistentState = await R.db?.addState('auth');

	// Восстановим сессию с диска
	setParams();

	// Подпишемся на изменения signedIn и inited на диске, чтобы реагировать на всех вкладках.
	// Первая подписка нужна для первичного прохода, чтобы вкладки ждали лидера.
	// Вторая подписка нужна для дальнейшего реагирования на смену состояния.
	persistentState.inited$.subscribe((inited: boolean) => {
		// Если инициализировано и состояние изменилось, учитывая что signedIn в store изначально undefined.
		if (inited && persistentState.signedIn !== p.store.signedIn) handleAuth(p.store, noodlNode);
	});
	persistentState.signedIn$.subscribe((storedSignedIn: boolean) => {
		// Сравним состояние на диске с состоянием текущей вкладки, есди инициализировано.
		if (persistentState.inited && storedSignedIn !== p.store.signedIn) handleAuth(p.store, noodlNode);
	});

	// Подпишемся на изменение ключа, чтобы остальные вкладки могли его использовать.
	// Kuzzle матерится, елси токен разные во вкладках.
	persistentState.token$.subscribe((token: string) => {
		// Записываем токен у всех вкладок, кроме лидера. Лидер делает это в vaildateRefreshToken.
		if (!p.store.isLeader && R.libs.Kuzzle) R.libs.Kuzzle.jwt = token;
	});

	// Тригер на вход пользователя. Перехватывает вход у вкладки не лидера.
	persistentState.signIn$.subscribe(async (storedSignedIn: boolean) => {
		if (storedSignedIn && p.store.isLeader) {
			// Отправим состояние процесса.
			sendOutput(noodlNode, 'signingIn', true);

			// Авторизуем пользователя
			const signedIn = await signIn(p, persistentState.username, persistentState.password);
			if (signedIn) {
				// Скачаем системные данные пользователя.
				await fetchUser();
				// Установим их глобально.
				setParams();
				// Запустим обновление токена.
				p.store.refreshInterval = setInterval(async () => await vaildateRefreshToken(p.sessionTimeout), ms('5s'));
			}
			// Изменим состояние на диске для всех вкладок.
			await persistentState.set('signedIn', () => signedIn);

			// Вернем флаг на место.
			await persistentState.set('signIn', () => false);

			// Отправим состояние процесса.
			sendOutput(noodlNode, 'signingIn', false);
		}
	});

	// Подпишемся на смену лидерства. Работает одинаково при первом проходе лидера и при смене лидера.
	// Делаем это в конце, чтобы иметь готовый persistentState.
	R.db?.waitForLeadership().then(async () => {
		p.store.isLeader = true;

		// Установим состояние инициализации на диск, чтобы другие вкладки ждали лидера.
		await persistentState.set('inited', () => false);

		// Отменим, если оффлайн.
		if (!R.db?.states.network.connected) {
			handleAuth(p.store, noodlNode);
			return;
		}

		// Проверим и обновим ключ, если авторизованы
		const tokenValid = persistentState.signedIn ? await vaildateRefreshToken(p.sessionTimeout) : false;

		// Запустим обновление токена, если токен валиден.
		if (tokenValid) p.store.refreshInterval = setInterval(async () => await vaildateRefreshToken(p.sessionTimeout), ms('1h'));
		else {
			// Сбросим токен и пользователя, чтобы useData не померала от неверного токена.
			await persistentState.set('token', () => undefined);
			await persistentState.set('user', () => undefined);
		}

		// Изменим состояние на диске для всех вкладок.
		await persistentState.set('signedIn', () => tokenValid);

		// Установим состояние инициализации на диск, чтобы другие вкладки могли проверить готовность.
		await persistentState.set('inited', () => true);
	});
};

const handleAuth = async (s: Store, noodlNode: NoodlNode) => {
	const signedIn = R.db?.states.auth.signedIn;

	if (signedIn) {
		s.signedIn = true;
		noodlNode.innerReactComponentRef.setSignInState(true);
		sendOutput(noodlNode, 'userRole', R.user?.user?.role?.value || null);
		sendSignal(noodlNode, 'signedIn');
		// Уберем анимацию загрузки, если указано в параметрах приложения.
		const { stopLoaderAnimationOn = 'authInitialized' } = Noodl.getProjectSettings();
		if (stopLoaderAnimationOn === 'authInitialized') systemLoaderAnimation.stop();
	} else {
		s.refreshInterval && clearInterval(s.refreshInterval);
		s.signedIn = false;
		noodlNode.innerReactComponentRef.setSignInState(false);
		sendOutput(noodlNode, 'userRole', null);
		sendSignal(noodlNode, 'signedOut');
		systemLoaderAnimation.stop(); // Выключаем лоадер при любой настройке, если не авторизован.
	}
};

const signIn = async (p: Props, username?: string, password?: string) => {
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
		const token = await K.auth.login('local', { username, password }, p.sessionTimeout);
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
