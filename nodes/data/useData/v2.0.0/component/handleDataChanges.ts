import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Props } from '../node/definition';
import { handleSubscribe } from './handleSubscribe';
import type { Item } from '@shared/types-v0.1.0';
import type { SchemeData } from '../node/store';
import Node from './Node';

export default (p: Props) => {
	// Подготовим иерархию. Она должна быть атомарной. Т.е. каждая нода содержит информацию о свзях, но свзяи не проложены.
	// Нужно создавать иерархию до обновления item. Построение иерархии их не требует, но ноды использующие иерархию,
	// будут запрашивать еще не существующие items. Общее правило - сначала меняется структура, потом содержание.
	let flatNodes: Node[] = [];
	Node.createHierarchy(p, flatNodes);

	// Создадим прокси нод иерархии или обновим их для реактивности.
	Node.setNodesProxy(p, flatNodes);

	// После построения иерархии можно выдать items.
	p.store.items.forEach((i) => R.items.set(i.id, i));

	if (p.subscribe) handleSubscribe(p);

	const data: { [dbClass: string]: SchemeData & { items: Item[] } } = {};

	// В data выдаем только родительские схемы.
	p.store.schemes.forEach((schemeData) => {
		const dbClass = schemeData.scheme.dbClass;

		if (!schemeData.parentId) {
			// items нужно выдавать согласно порядку в itemIds, чтобы сохранить серверную сортировку.
			data[dbClass] = {
				...schemeData,
				items: schemeData.itemIds.map((id) => R.items.get(id)).filter((i) => i !== undefined),
			};

			if (p.outputDbClasses?.includes(dbClass)) {
				sendOutput(
					p.noodlNode,
					`${dbClass}Items`,
					schemeData.itemIds.map((id) => R.items.get(id)).filter((i) => i !== undefined)
				);
				sendOutput(p.noodlNode, `${dbClass}Fetched`, schemeData.fetched);
				sendOutput(p.noodlNode, `${dbClass}Total`, schemeData.total);
				sendOutput(p.noodlNode, `${dbClass}Aggregations`, schemeData.aggregations);
			}
		}
	});

	sendOutput(p.noodlNode, 'data', data);
	sendOutput(p.noodlNode, 'rootId', p.store.rootId);
	sendOutput(p.noodlNode, 'rootNode', R.nodes.get(p.store.rootId));
	sendOutput(p.noodlNode, 'schemes', Array.from(p.store.schemes.values()));
	sendOutput(p.noodlNode, 'fetching', false);
	sendSignal(p.noodlNode, 'fetched');
};
