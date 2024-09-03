import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import setParams from '../component/src/setParams';
import type { Props } from '../node/definition';
import systemLoaderAnimation from '@shared/system-loader-animation-v0.1.0';
import { getKuzzle } from '@shared/get-kuzzle-v0.2.0';
import fetchUser from '../component/src/fetchUser';
import ms from 'ms';
import vaildateRefreshToken from '../component/src/vaildateRefreshToken';

type Store = { signedIn: boolean | undefined; isLeader: boolean; refreshInterval?: NodeJS.Timeout };

export default async (p: Props) => {
	// Создадим хранилище для сравнения параметров.
	const s: Store = { signedIn: undefined, isLeader: false, refreshInterval: undefined };

	// Возьмем состояние с диска. addState возвращает текущее состояние, если есть, иначе создает.
	// Делаем это вначале, чтобы далее использовать новое пустое или текущее состояние на диске.
	const persistentState = await R.db?.addState('auth');

	// Восстановим сессию с диска.
	await setParams();

	// Подпишемся на изменения signedIn и inited на диске, чтобы реагировать на всех вкладках.
	// Первая подписка нужна для первичного прохода, чтобы вкладки ждали лидера.
	// Вторая подписка нужна для дальнейшего реагирования на смену состояния.
	persistentState.inited$.subscribe((inited: boolean) => {
		console.log('inited', { inited, stored: persistentState.signedIn, local: s.signedIn, leader: s.isLeader });
		// Если инициализировано и состояние изменилось, учитывая что signedIn в store изначально undefined.
		if (inited && persistentState.signedIn !== s.signedIn) handleAuth(p, s);
	});
	persistentState.signedIn$.subscribe((storedSignedIn: boolean) => {
		console.log('signedIn sub', { stored: storedSignedIn, local: s.signedIn, leader: s.isLeader });
		// Сравним состояние на диске с состоянием текущей вкладки, есди инициализировано.
		if (persistentState.inited && storedSignedIn !== s.signedIn) handleAuth(p, s);
	});

	// Подпишемся на изменение ключа, чтобы остальные вкладки могли его использовать.
	// Kuzzle матерится, елси токен разные во вкладках.
	persistentState.token$.subscribe((token: string) => {
		console.log('token sub', { token, stored: persistentState.signedIn, local: s.signedIn, leader: s.isLeader });
		// Записываем токен у всех вкладок, кроме лидера. Лидер делает это в vaildateRefreshToken.
		if (!s.isLeader && R.libs.Kuzzle) R.libs.Kuzzle.jwt = token;
	});

	// Тригер на вход пользователя. Перехватывает вход у вкладки не лидера.
	persistentState.signIn$.subscribe(async (storedSignedIn: boolean) => {
		console.log('signIn sub', { stored: storedSignedIn, local: s.signedIn, leader: s.isLeader });
		if (storedSignedIn && s.isLeader) {
			// Отправим состояние процесса.
			sendOutput(p.noodlNode, 'signingIn', true);

			// Авторизуем пользователя
			const signedIn = await signIn(p, persistentState.username, persistentState.password);
			if (signedIn) {
				// Скачаем системные данные пользователя.
				await fetchUser();
				// Установим их глобально.
				setParams();
				// Запустим обновление токена.
				s.refreshInterval = setInterval(async () => await vaildateRefreshToken(p.sessionTimeout), ms('5s'));
			}
			// Изменим состояние на диске для всех вкладок.
			await persistentState.set('signedIn', () => signedIn);

			// Вернем флаг на место.
			await persistentState.set('signIn', () => false);

			// Отправим состояние процесса.
			sendOutput(p.noodlNode, 'signingIn', false);
		}
	});

	// Подпишемся на смену лидерства. Работает одинаково при первом проходе лидера и при смене лидера.
	// Делаем это в конце, чтобы иметь готовый persistentState.
	R.db?.waitForLeadership().then(async () => {
		console.log('waitForLeadership', { stored: persistentState.signedIn, local: s.signedIn, leader: s.isLeader });
		s.isLeader = true;

		// Установим состояние инициализации на диск, чтобы другие вкладки ждали лидера.
		await persistentState.set('inited', () => false);

		// Отменим, если оффлайн.
		if (!R.db?.states.network.connected) {
			handleAuth(p, s);
			return;
		}

		// Проверим и обновленим ключ, если авторизованы
		const tokenValid = persistentState.signedIn ? await vaildateRefreshToken(p.sessionTimeout) : false;

		// Запустим обновление токена, если токен валиден.
		if (tokenValid) s.refreshInterval = setInterval(async () => await vaildateRefreshToken(p.sessionTimeout), ms('5s'));
		// Изменим состояние на диске для всех вкладок.
		await persistentState.set('signedIn', () => tokenValid);

		// Установим состояние инициализации на диск, чтобы другие вкладки могли проверить готовность.
		await persistentState.set('inited', () => true);
	});
};

const handleAuth = async (p: Props, s: Store) => {
	const signedIn = R.db?.states.auth.signedIn;
	console.log('handleAuth', { stored: signedIn, local: s.signedIn, leader: s.isLeader });
	if (signedIn) {
		sendOutput(p.noodlNode, 'userRole', R.user?.user?.role?.value || null);
		sendSignal(p.noodlNode, 'signedIn');
		// Уберем анимацию загрузки, если указано в параметрах приложения.
		const { stopLoaderAnimationOn = 'authInitialized' } = Noodl.getProjectSettings();
		if (stopLoaderAnimationOn === 'authInitialized') systemLoaderAnimation.stop();
		s.signedIn = true;
	} else {
		sendOutput(p.noodlNode, 'userRole', null);
		sendSignal(p.noodlNode, 'signedOut');
		systemLoaderAnimation.stop(); // Выключаем лоадер при любой настройке, если не авторизован.
		s.signedIn = false;
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
