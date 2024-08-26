import { sendSignal } from '@shared/port-send-v1.0.0';
import type { Props } from '../types';
import { fetch } from './fetch';
import { subscribe, unSubscribe } from './handleSubscribe';

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
		if (!R.libs.just.compare(p.store.fetchScheme, p.fetchScheme)) {
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

			// Тригер смены выбора.
			R.libs.valtio.subscribe(p.store.itemsSelectionState, () => {
				sendSignal(p.noodlNode, 'itemsStateChanged');
			});

			// Отпишимся при удалении ноды во избежание задвоения подписок.
			p.noodlNode._onNodeDeleted = () => unSubscribe(p);
		}

		return;
	},
	fetch: async (p: Props) => fetch(p),
};
