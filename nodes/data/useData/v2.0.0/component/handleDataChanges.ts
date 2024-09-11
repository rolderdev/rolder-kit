import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Props } from '../node/definition';
import type { Item } from '@shared/types-v0.1.0';
import type { SchemeData } from '../node/store';
import Node from './Node';
import type { NoodlNode } from '@shared/node-v1.0.0';

export default (p: Props, noodlNode: NoodlNode) => {
	// Подготовим иерархию. Она должна быть атомарной. Т.е. каждая нода содержит информацию о свзях, но свзяи не проложены.
	let flatNodes: Node[] = [];
	Node.createHierarchy(p, flatNodes);

	// Создадим прокси нод иерархии или обновим их для реактивности.
	Node.setNodesProxy(p, flatNodes);

	const data: { [dbClass: string]: SchemeData & { items: Item[] } } = {};

	// В data выдаем только родительские схемы.
	p.store.schemes.forEach((schemeData) => {
		const dbClass = schemeData.scheme.dbClass;

		if (!schemeData.parentId) {
			data[dbClass] = {
				...schemeData,
				items: schemeData.itemIds.map((id) => R.items[id]).filter((i) => i !== undefined),
			};

			if (p.outputDbClasses?.includes(dbClass)) {
				sendOutput(
					noodlNode,
					`${dbClass}Items`,
					schemeData.itemIds.map((id) => R.items[id]).filter((i) => i !== undefined)
				);
				sendOutput(noodlNode, `${dbClass}Fetched`, schemeData.fetched);
				sendOutput(noodlNode, `${dbClass}Total`, schemeData.total);
				sendOutput(noodlNode, `${dbClass}Aggregations`, schemeData.aggregations);
			}
		}
	});

	sendOutput(noodlNode, 'data', data);
	sendOutput(noodlNode, 'rootId', p.store.rootId);
	sendOutput(noodlNode, 'rootNode', R.nodes[p.store.rootId]);
	sendOutput(noodlNode, 'schemes', Array.from(p.store.schemes.values()));
	sendOutput(noodlNode, 'fetching', false);
	sendSignal(noodlNode, 'fetched');
};
