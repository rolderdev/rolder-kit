import { sendSignal } from '@shared/port-send-v1.0.0';
import type { Props } from '../node/definition';
import { fetch } from './fetch';
import { handleNotification, subscribe, type Notification } from './handleSubscribe';
import type { JsComponent, NoodlNode } from '@shared/node-v1.0.0';

const reactive = async (p: Props, noodlNode: NoodlNode) => {
	// Обработаем измения инпутов
	if (p.store.apiVersion !== p.apiVersion) {
		p.store.apiVersion = p.apiVersion;
		if (!p.controlled) await fetch(p, noodlNode);
	}
	// Загрузим данные при включении реактивного режима в редакторе.
	if (p.store.controlled !== p.controlled) {
		if (p.store.controlled && !p.controlled) await fetch(p, noodlNode);
		p.store.controlled = p.controlled;
	}
	// Сравним схему.
	if (!R.libs.just.compare(p.store.fetchScheme, p.fetchScheme)) {
		p.store.fetchScheme = p.fetchScheme;
		if (!p.controlled) await fetch(p, noodlNode);
	}
	// Отреагируем на включение/отключение подписки.
	if (p.store.subscribe !== p.subscribe) {
		if (!p.store.subscribe && p.subscribe) subscribe(p);
		//if (p.store.subscribe && !p.subscribe) unSubscribe(p);
		p.store.subscribe = p.subscribe;
	}

	// Первый проход.
	if (!p.store.inited) {
		// Первичная загрузка реактивного режима.
		if (!p.controlled) await fetch(p, noodlNode);

		// Тригер смены выбора.
		const rootNode = R.nodes[p.store.rootId];
		if (rootNode) Noodl.Events.on(`${rootNode.path}_selectionChanged`, () => sendSignal(noodlNode, 'nodesSelectionChanged'));

		// Хак. Добавим свой клиент WebSocket и listener к нему.
		if (!p.store.socket) p.store.socket = new WebSocket(`wss://${R.libs.Kuzzle?.host}`);
		p.store.socket.onmessage = (event) => {
			if (event.data === '{"p":2}') return; // Если это сообщение прокси сервера, пропускаем.
			const data = JSON.parse(event.data) as Notification;
			if (data.type !== 'document') return; // Если это сообщение не о подписке, пропускаем.
			const roomId = data.room.split('-')[0];
			let schemeHash = '';
			p.store.subscribes.forEach((room, hash) => {
				if (roomId === room) schemeHash = hash;
			});
			if (!schemeHash) return; // Если нет такой схемы в подписках, значит другая useData.
			handleNotification(p, noodlNode, schemeHash, data);
		};

		p.store.inited = true;
	}

	return;
};

export default {
	reactive,
	fetch: async (p: Props, noodlNode) => fetch(p, noodlNode),
	resetNodesSelection: (p: Props, noodlNode) => {
		Object.values(R.nodes)
			.filter((i) => i.rootId === p.store.rootId)
			.forEach((i) => (i.selectionState.value = 'notSelected'));

		sendSignal(noodlNode, 'nodesSelectionChanged');
		if (!p.controlled) reactive(p, noodlNode);
	},
} as JsComponent;
