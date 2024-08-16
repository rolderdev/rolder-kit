import { subscribe as sub } from 'valtio';
import compare from 'just-compare';
import type { Props } from '../types';
import { fetch } from './fetch';
import { handleSubscribe, subscribe, unSubscribe } from './handleSubscribe';
import setHierarchy from './setHierarchy';
import setRefs from './setRefs';
import sendOutputs from './sendOutputs';

export default {
	reactive: async (p: Props) => {
		// Обработаем измения инпутов
		if (p.store.apiVersion !== p.apiVersion) {
			p.store.apiVersion = p.apiVersion;
			if (!p.controlled) await fetch(p);
		}
		// Загрузим данные при включении реактивного режима в редакторе.
		if (p.store.controlled !== p.controlled) {
			if (p.store.controlled && !p.controlled) await fetch(p);
			p.store.controlled = p.controlled;
		}
		// Сравним схему.
		if (!compare(p.store.fetchScheme, p.fetchScheme)) {
			p.store.fetchScheme = p.fetchScheme;
			if (!p.controlled) await fetch(p);
		}
		// Отреагируем на включение/отключение подписки.
		if (p.store.subscribe !== p.subscribe) {
			if (!p.store.subscribe && p.subscribe) subscribe(p);
			if (p.store.subscribe && !p.subscribe) unSubscribe(p);
			p.store.subscribe = p.subscribe;
		}

		// Первый проход.
		if (!p.store.inited) {
			p.store.inited = true;

			// Первичная загрузка реактивного режима.
			if (!p.controlled) await fetch(p);

			// Отпишимся при удалении ноды во избежание задвоения подписок.
			p.noodlNode._onNodeDeleted = () => unSubscribe(p);
		}

		return;
	},
	fetch: async (p: Props) => fetch(p),
};
