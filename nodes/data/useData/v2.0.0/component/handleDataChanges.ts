import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Props } from '../types';
import { handleSubscribe } from './handleSubscribe';
import setHierarchy from './setHierarchy';
import setRefs from './setRefs';
import type { FrontItem } from '@shared/types-v0.1.0';
import type { SchemeData } from '../node/store';

export default (p: Props) => {
	if (p.subscribe) handleSubscribe(p);
	setRefs(p); // Проставим связи.
	setHierarchy(p); // Построим новую иерархию.

	const data: { [dbClass: string]: Omit<SchemeData, 'itemIds' | 'items'> & { items: FrontItem[] } } = {};
	// В data выдаем только родительские схемы.
	p.store.schemes.forEach((schemeData) => {
		const dbClass = schemeData.scheme.dbClass;

		if (!schemeData.parentId) {
			const { snapshot } = R.libs.valtio;

			// snapshot - запретим редактирование всего кроме items.
			// items нужно выдавать согласно порядку в itemIds, чтобы сохранить серверную сортировку.
			data[dbClass] = {
				...R.libs.just.omit(snapshot(schemeData), ['itemIds', 'items']),
				items: schemeData.itemIds.map((kid) => schemeData.items.get(kid)).filter((i) => i !== undefined),
			};

			sendOutput(
				p.noodlNode,
				`${dbClass}Items`,
				schemeData.itemIds.map((kid) => schemeData.items.get(kid)).filter((i) => i !== undefined)
			);
			sendOutput(p.noodlNode, `${dbClass}Fetched`, schemeData.fetched);
			sendOutput(p.noodlNode, `${dbClass}Total`, schemeData.total);
			sendOutput(p.noodlNode, `${dbClass}Aggregations`, schemeData.aggregations);
		}
	});

	sendOutput(p.noodlNode, 'data', data);
	sendOutput(p.noodlNode, 'hierarchyRootNode', p.store.rootHierarchyNode);
	sendOutput(p.noodlNode, 'schemes', Array.from(p.store.schemes.values()));
	sendOutput(p.noodlNode, 'fetching', false);
	sendSignal(p.noodlNode, 'fetched');
};
