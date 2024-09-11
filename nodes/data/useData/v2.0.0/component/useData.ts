import { sendSignal } from '@shared/port-send-v1.0.0';
import type { Props } from '../node/definition';
import { fetch } from './fetch';
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
		await fetch(p, noodlNode); // Нужно перезагрузить данные, т.к. подписки прилетают с сервреа.
		p.store.subscribe = p.subscribe;
	}

	// Первый проход.
	if (!p.store.inited) {
		// Первичная загрузка реактивного режима.
		if (!p.controlled) await fetch(p, noodlNode);

		// Тригер смены выбора.
		const rootNode = R.nodes[p.store.rootId];
		if (rootNode) Noodl.Events.on(`${rootNode.path}_selectionChanged`, () => sendSignal(noodlNode, 'nodesSelectionChanged'));

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
