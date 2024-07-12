import { forwardRef, useEffect, useImperativeHandle } from 'react';
import type { Props } from './types';
import { authStore } from './src/store';
import vaildateRefreshToken from './src/vaildateRefreshToken';
import fetchUserAndSystemCreds from './src/fetchUserAndSystemCreds';
import setParams from './src/setParams';

export default forwardRef(function (props: Props, ref) {
	//const { noodlNode, sessionTimeout = '5d' } = props;
	const { noodlNode } = props;
	const sessionTimeout = '15s';

	const signedIn = authStore.signedIn.use();
	const isLeader = authStore.isLeader.use();
	console.log({ signedIn, isLeader });

	useEffect(() => {
		const parentNodeName = props.noodlNode.parent.model.type?.split('.')[1];
		if (parentNodeName !== 'Data') {
			log.error('Auth node error:', `Parent node must be Data, got ${parentNodeName}`);
			R.libs.mantine?.MantineError?.('Системная ошибка!', `Auth node error: parent node must be Data, got ${parentNodeName}`);
		}

		// Попишемся на общее хранилище на диске.
		R.db?.addState('auth').then((persistentStore) => {
			/* persistentStore.get$().subscribe(async (persistentStore: any) => {
				if (!authStore.inited.get()) {
					if (authStore.isLeader.get()) authStore.init(noodlNode, sessionTimeout);
					else {
						await setParams();
						authStore.noodlNode.set(noodlNode);
						authStore.sessionTimeout.set(sessionTimeout);
						if (R.libs.Kuzzle) R.libs.Kuzzle.jwt = persistentStore.token;
						authStore.inited.set(true);
						authStore.signedIn.set(true);
					}
				} else if (!authStore.isLeader.get()) {
					console.log('not leader', persistentStore);
					if (R.libs.Kuzzle) R.libs.Kuzzle.jwt = persistentStore.token;
					if (persistentStore.signedIn !== authStore.signedIn.get()) authStore.signedIn.set(persistentStore.signedIn);
				}
			});
		}); */

			// Инициализация. Это место запускается один раз.
			authStore.init(noodlNode, sessionTimeout);
			// Подпишемся на изменение токена и будем его передавать в Kuzzle, если это не лидер.
			// Важно не допускать подключения к Kuzzle разными ключами в рамках одной сессии, хоть и в разных окнах.
			persistentStore.token$.subscribe(async (token: string) => {
				if (!authStore.isLeader.get() && R.libs.Kuzzle) R.libs.Kuzzle.jwt = token;
			});
			// Подпишемся на изменение состояния авторизации.
			// Нужно для сценариев, когда вышли в одной вкладке и когда был возврат в сеть и проверка токена провалилась.
			// Эти сценарии выполняет лидер.
			persistentStore.signedIn$.subscribe(async (signedIn: boolean) => {
				if (!authStore.isLeader.get()) authStore.signedIn.set(signedIn);
			});
		});

		// Подпишемся на состояние сети, чтобы валидировать сессию, не дожидаясь проверки-обновления ключа по расписанию.
		R.db?.states.network.connected$.subscribe(async (connected: boolean) => {
			// Проверяем только если авторизованы, не первый запуск и подключение восстановлено.
			if (authStore.signedIn.get() && authStore.inited.get() && connected) {
				console.log('connection restored');
				if (await vaildateRefreshToken(authStore)) {
					await fetchUserAndSystemCreds();
					authStore.signedIn.set(true);
				} else authStore.signedIn.set(false);
			}
		});
		// Подпишемся на изменение лидерства.
		R.db?.waitForLeadership().then(() => {
			console.log('waitForLeadership');
			authStore.isLeader.set(true);
		});
	}, []);

	useImperativeHandle(
		ref,
		() => ({
			signIn() {
				authStore.signIn(props.username, props.password);
			},
		}),
		[props]
	);

	return <>{signedIn === true ? props.children : null}</>;
});
