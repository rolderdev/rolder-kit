import { forwardRef, memo, useEffect, useImperativeHandle } from 'react';
import type { Props } from './types';
import { authStore as store } from './src/store';
import setParams from './src/setParams';
import fetchUser from './src/fetchUser';
import vaildateRefreshToken from './src/vaildateRefreshToken';
import { useInterval } from '@mantine/hooks';
import ms from 'ms';
import { sendOutput } from '@packages/port-send';

// memo для того, чтобы не реагировать на изменяющиеся логин/пароль при печати.
export default memo(
	forwardRef(function (props: Props, ref) {
		const { noodlNode, sessionTimeout = '5d' } = props;

		const signedIn = store.signedIn.use();

		useEffect(() => {
			const parentNodeName = props.noodlNode.parent.model.type?.split('.')[1];
			if (parentNodeName !== 'Data') {
				log.error('Auth node error:', `Parent node must be Data, got ${parentNodeName}`);
				R.libs.mantine?.MantineError?.('Системная ошибка!', `Auth node error: parent node must be Data, got ${parentNodeName}`);
			}

			// Сохраним в состоянии параметры, для удобства.
			store.noodlNode.set(noodlNode);
			store.sessionTimeout.set(sessionTimeout);

			// useEffect не умеет делать async, поэтому используем асинхронную IIFE, чтобы не извращаться с then.
			(async () => {
				// Возьмем состояние с диска. addState возвращает текущее состояние, если есть, иначе создает.
				// Делаем это вначале, чтобы далее использовать новое пустое или текущее состояние на диске.
				const persistentState = await R.db?.addState('auth');

				// Восстановим сессию с диска, кроме signedIn.
				await setParams();

				// Подпишемся на изменения signedIn и inited на диске, чтобы реагировать на всех вкладках.
				// Первая подписка нужна для первичного прохода, чтобы вкладки ждали лидера.
				// Вторая подписка нужна для дальнейшего реагирования на смену состояния.
				persistentState.inited$.subscribe((inited: boolean) => {
					// Если инициализировано и состояние изменилось, учитывая что signedIn в store изначально undefined.
					if (inited && persistentState.signedIn !== store.signedIn.get()) store.handleAuth();
				});
				persistentState.signedIn$.subscribe((storedSignedIn: boolean) => {
					// Сравним состояние на диске с состоянием текущей вкладки, есди инициализировано.
					if (persistentState.inited && storedSignedIn !== store.signedIn.get()) store.handleAuth();
				});

				// Подпишемся на изменение ключа, чтобы остальные вкладки могли его использовать.
				// Kuzzle матерится, елси токен разные во вкладках.
				persistentState.token$.subscribe((token: string) => {
					// Записываем токен у всех вкладок, кроме лидера. Лидер делает это в vaildateRefreshToken.
					if (!store.isLeader.get() && R.libs.Kuzzle) R.libs.Kuzzle.jwt = token;
				});

				// Тригер на вход пользователя. Перехватывает вход у вкладки не лидера.
				persistentState.signIn$.subscribe(async (signIn: boolean) => {
					if (signIn && store.isLeader.get()) {
						// Отправим состояние процесса.
						sendOutput(noodlNode, 'signingIn', true);

						// Авторизуем пользователя
						const signedIn = await store.signIn(persistentState.username, persistentState.password);
						if (signedIn) {
							// Скачаем системные данные пользователя.
							await fetchUser();
							// Установим их глобально.
							setParams();
							// Запустим обновление токена.
							refreshToken.start();
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
					store.isLeader.set(true);

					// Устаноим состояние инициализации на диск, чтобы другие владки ждали лидера.
					await persistentState.set('inited', () => false);

					// Отменим, если оффлайн.
					if (!R.db?.states.network.connected) {
						store.handleAuth();
						return;
					}

					// Проверим и обновленим ключ, если авторизованы
					const tokenValid = persistentState.signedIn ? await vaildateRefreshToken(sessionTimeout) : false;
					// Запустим обновление токена, если токен валиден.
					if (tokenValid) refreshToken.start();
					// Изменим состояние на диске для всех вкладок.
					await persistentState.set('signedIn', () => tokenValid);

					// Устаноим состояние инициализации на диск, чтобы другие владки могли проверить готовность.
					await persistentState.set('inited', () => true);
				});
			})();
		}, []);

		// Установим расписание для проверки и обновления токена.
		const refreshToken = useInterval(() => vaildateRefreshToken(sessionTimeout), ms('1h'));

		// Примем внешние сигналы.
		useImperativeHandle(
			ref,
			() => ({
				async signIn() {
					// Авторизуем пользователя, переключив флаг, чтобы авторизация произошла у лидера по подписке.
					await R.db?.states.auth.set('username', () => props.username);
					await R.db?.states.auth.set('password', () => props.password);
					await R.db?.states.auth.set('signIn', () => true);
				},
			}),
			[props]
		);

		return <>{signedIn === true ? props.children : null}</>;
	})
);
