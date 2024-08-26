import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Props } from '../types';
import { handleSubscribe } from './handleSubscribe';
import type { Item } from '@shared/types-v0.1.0';
import type { SchemeData } from '../node/store';
import setHierarchy from './setHierarchy';

export default (p: Props) => {
	if (p.subscribe) handleSubscribe(p);
	setHierarchy(p); // Построим/обновим иерархию. Она же обновляет сами items.

	const data: { [dbClass: string]: SchemeData & { items: Item[] } } = {};
	// В data выдаем только родительские схемы.
	p.store.data.schemes.forEach((schemeData) => {
		const dbClass = schemeData.scheme.dbClass;

		if (!schemeData.parentId) {
			const { snapshot } = R.libs.valtio;

			// snapshot - запретим редактирование всего кроме items.
			// items нужно выдавать согласно порядку в itemIds, чтобы сохранить серверную сортировку.
			data[dbClass] = {
				...(snapshot(schemeData) as SchemeData),
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
	sendOutput(p.noodlNode, 'hierarchyRootItem', p.store.rootItem);
	sendOutput(p.noodlNode, 'schemes', Array.from(p.store.data.schemes.values()));
	sendOutput(p.noodlNode, 'fetching', false);
	sendSignal(p.noodlNode, 'fetched');
};
