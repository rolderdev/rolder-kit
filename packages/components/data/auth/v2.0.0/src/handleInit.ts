/* Инициализирует состояние авторизации и параметров (user, creds для nodered и s3, dbClasses).
Запускается при монтировании Auth и возврату в сеть. */

import fetchUserAndSystemCreds from './fetchUserAndSystemCreds';
import setParams from './setParams';
import type { Store } from './store';
import vaildateRefreshToken from './vaildateRefreshToken';

export default async function (store: Store) {
	const signedIn = await R.db?.states.auth.signedIn;
	const token = await R.db?.states.auth.token;

	// Нужно восстановить сохраненные параметры на случай, если мы оффлайн.
	await setParams();
	// Токен нужно подать в Kuzzle при любом сценарии.
	if (R.libs.Kuzzle) R.libs.Kuzzle.jwt = token;

	// Если мы оффлайн, оставляем все как есть до момента возвращения в сеть.
	// В auth есть хука, которая запускается при возврате в сеть и запускает процесс заново.
	if (!R.db?.states.network.connected) store.signedIn.set(signedIn);
	// Если уже знаем, что не авторизованы, завершаем без проверки.
	else if (!signedIn) store.signedIn.set(false);
	else {
		// Если на диске сохранена авторизация, нужно проверить ее.
		if (await vaildateRefreshToken(store)) {
			// Загрузим параметры не смотря на то, что они могли быть на диске.
			await fetchUserAndSystemCreds();
			store.signedIn.set(true);
		} else store.signedIn.set(false);
	}

	store.inited.set(true);
}
