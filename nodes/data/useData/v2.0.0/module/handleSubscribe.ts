import { getKuzzle } from '@packages/get-kuzzle';
import type { Props } from '../types';
import { dbClassVersion } from '@packages/get-dbclass-version';
import set from 'just-safe-set';
import { schemeChanged } from './schemeChanged';

export const handleSubscribe = async (p: Props) => {
	const { subscribe, fetchScheme, subscribeScheme } = p.store.get();

	// Если не Первый проход.
	/* {
		// Переключение схемы, нужно отписаться и подписаться снова.
		if (useFetchScheme !== p.useFetchScheme && p.subscribe) {
			await subscribeOff(p);
			await subscribeOn(p);
		} else {
			// Включение/отключение из редактора.
			if (!subscribe && p.subscribe) await subscribeOn(p);
			if (subscribe && !p.subscribe) await subscribeOff(p);
		}
	} */

	// Первый проход.
	if (subscribe === undefined) {
		if (p.subscribe) {
			console.log('sub first on');
			await subscribeOn(p);
		} else {
			console.log('sub first off');
			await subscribeOff(p);
		}
	} else if (schemeChanged(subscribeScheme || fetchScheme, p.subscribeScheme || p.fetchScheme) && subscribe === p.subscribe) {
		console.log('schemeChanged');
		// Изменение содержания иди вида схемы. Нужно отписаться и подписаться снова.
		await subscribeOff(p);
		await subscribeOn(p);
	} else {
		// Включение/отключение из редактора.
		if (!subscribe && p.subscribe) {
			console.log('sub on');
			await subscribeOn(p);
		}
		if (subscribe && !p.subscribe) {
			console.log('sub off');
			await subscribeOff(p);
		}
	}

	p.store.set((s) => {
		if (!p.subscribe) s.subscribe = false; // Чтобы просле первого прохода не было undefined.
		else s.subscribe = p.subscribe;
		s.useFetchScheme = p.useFetchScheme; // Для последующих сравенений, чтобы тригерить переподключение при смене вида схемы.
		s.subscribeScheme = p.subscribeScheme; // Для последующих сравенений, чтобы тригерить переподключение при смене содержания схемы.
	});
};

const subscribeOn = async (p: Props) => {
	const { dbName } = window.R.env;
	if (!dbName) return;

	const K = await getKuzzle();
	if (!K) return;
	// Берем fetchScheme из props, т.к. этот код запускается до handleChanges.
	let schemes = p.subscribeScheme || p.fetchScheme;

	// В типе задана строка для dbClassV, но она может быть false. Поэтому ниже проверка, чтобы остановить при ошибках в dbClassVersion.
	schemes = schemes.map((i) => ({ ...i, dbClassV: dbClassVersion(i.dbClass) as string }));

	if (!schemes.some((i) => !i.dbClassV))
		Promise.all(
			schemes.map((scheme) =>
				K.realtime
					.subscribe(dbName, scheme.dbClassV, scheme.filters || {}, (notif) => {
						if (notif.type !== 'document') return;

						log.info(`Subscribe - ${notif.action} ${scheme.dbClass}: `, notif.result);
					})
					.then((room) => {
						p.store.set((state) => {
							set(state, ['subscribes', scheme.dbClass], room);
						});

						log.info(`Subscribed to ${scheme.dbClass}`);
					})
					.catch((error) => log.error(`Subscribe error`, error))
			)
		);
};

const subscribeOff = async (p: Props) => {
	const { dbName } = window.R.env;
	if (!dbName) return;

	const K = await getKuzzle();
	if (!K) return;

	const schemes = p.subscribeScheme || p.fetchScheme;

	Promise.all(
		schemes.map((scheme) => {
			const room = p.store.subscribes.get((state) => state?.[scheme.dbClass]);
			if (room)
				K.realtime
					.unsubscribe(room)
					.then(() => {
						p.store.set((state) => {
							set(state, ['subscribes', scheme.dbClass], undefined);
						});

						log.info(`Unsubscribed from ${scheme.dbClass}`);
					})
					.catch((error) => log.error(`Unsubscribe error`, error));
		})
	);
};
