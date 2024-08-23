import { getKuzzle } from '@shared/get-kuzzle';
import { sendOutput } from '@shared/port-send-v1.0.0';
import type { Props } from '../types';
import handleDataChanges from './handleDataChanges';
import type { FrontItem, Item } from '@shared/types-v0.1.0';
import createFrontItem from './createFrontItem';
import type { BackendSchemeData } from '../node/store';

export const fetch = async (p: Props) => {
	const K = await getKuzzle();
	if (!K) return;

	const MantineError = R.libs.mantine?.MantineError;

	const { dbName } = R.env;
	if (!dbName) {
		MantineError?.('Системная ошибка!', `No dbName at R.env`);
		log.error('No dbName', R.env);
		return;
	}

	const { map } = R.libs.just;

	const { fetchScheme } = p.store;

	const startTime = log.start();
	log.info(`useData props: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, p);

	sendOutput(p.noodlNode, 'fetching', true);

	const response = await K.query({ controller: 'rolder', action: `fetch_${p.apiVersion}`, dbName, fetchScheme });
	const data = response.result as {
		items: { [kid: string]: Item };
		schemes: { [schemeHash: string]: BackendSchemeData };
		error?: { message: string; dbClass?: string; metaData: any };
	};

	if (data.error) {
		log.error('Kuzzle error.', { error: data.error.message, metaData: data.error.metaData });
		MantineError?.('Системная ошибка!', `Kuzzle error. ${data.error.message}`);
	}

	// Обновим прокси базовых item, тем самым добавив, удалив или обновив наследуемые.
	// Здесь прокси valtio - т.е. реактивна вся структура item.
	map(data.items, (kid, item) => p.store.items.set(kid, item));
	p.store.items.forEach((_, kid) => {
		if (!R.libs.just.has(data.items, kid)) p.store.items.delete(kid);
	});

	// Подготовим схемы и frontItems. Каждая схема имеет свои frontItems.
	// Каждый frontItem - это прокси item. Items уникальны, но несколько frontItems могут использовать один item.
	// С сервера в каждой схеме прилетает список kid, загруженных этой схемой с учетом сортировки. Важно сохранит сортировку.
	// В рамках одной схемы не может быть двух kid. Значит мы можем запрашивать по ним. Поэтому, в каждой схеме сохряняется список kid
	// как есть, а сам frontItems хроняться в Map так же по kid.
	map(data.schemes, (schemeHash, backendSchemeData) => {
		const frontItems = new Map<string, FrontItem>();
		// Добавление и обновление.
		// Здесь нам не важна сортировка, это решено в handleDataChanges.
		for (const kid of backendSchemeData.itemIds) {
			const backItem = p.store.items.get(kid);
			if (backItem) {
				const frontItem = p.store.schemes.get(schemeHash)?.items.get(kid);
				// Если есть, обновляем, сохранив fid (id).
				if (frontItem) frontItems.set(kid, { ...frontItem, ...backItem });
				// Иначе, создаем новый.
				else createFrontItem(frontItems, backItem);
			}
		}
		// Обновим/создадим схему. Т.к. в frontItems только новые и измененные, это удалит устаревшие.
		p.store.schemes.set(schemeHash, { ...backendSchemeData, items: frontItems });
	});

	// Удаление устаревших схем.
	p.store.schemes.forEach((_, schemeHash) => {
		if (!R.libs.just.has(data.schemes, schemeHash)) p.store.schemes.delete(schemeHash);
	});

	// Подготовим связи, иерархию, данные для отправки и отправим их.
	handleDataChanges(p);

	log.info(`useData: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, data);
	log.end(`useData: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, startTime);

	return;
};
