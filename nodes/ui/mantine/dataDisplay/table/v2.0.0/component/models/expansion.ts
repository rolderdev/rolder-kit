/* Модель расширяемых строк. */

import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Store } from '../../node/store';
import useNode from '../funcs/useNode';
import useItem from '../funcs/useItem';

export type ExpansionRows = Record<string, React.ReactNode>;

// Метод установки состояния развернутой строки по клику на строку или шеврон.
export const toggleRowExpansion = (s: Store, id: string) => {
	if (s.expandedIds[id]) s.expandedIds[id] = false;
	else s.expandedIds[id] = true;

	setHierarhyExpansion(s);

	sendOutput(
		s.noodlNode,
		'expandedItems',
		R.libs.just.map(s.expandedIds, (id, v) => v && R.items[id])
	);
	sendSignal(s.noodlNode, 'expandedItemsChanged');
};

// Метод установки новых строк с порта.
// На уровне декларации порта проверяется, что нельзя подать массив с несколькими items, если allowMultiple = false.
export const setExpandedIds = (s: Store, expandedIds: string[], isDefault?: boolean) => {
	const { compare } = R.libs.just;

	// Отфильтруем по items этой таблицы и функцией разработчика.
	const newExpandedIds = expandedIds.filter((id) => s.records.map((i) => i.id).includes(id) && !expansionDisabled(s, id));
	const expendedIds = Object.keys(s.expandedIds).filter((id) => s.expandedIds[id]);

	if (!compare(expendedIds.sort(), newExpandedIds.sort())) {
		s.expandedIds = {};
		newExpandedIds.map((id) => (s.expandedIds[id] = true));

		setHierarhyExpansion(s);

		sendOutput(
			s.noodlNode,
			'expandedItems',
			newExpandedIds.map((id) => R.items[id])
		);
		if (!isDefault) sendSignal(s.noodlNode, 'expandedItemsChanged');
	}
};

// Метод фильтрации.
export const expansionDisabled = (s: Store, id: string) => {
	let disabled = false;
	try {
		const filterFunc = s.tableProps.expansion.filterFunc;
		const itemSnap = useItem(id, 'snap');
		disabled = itemSnap && filterFunc ? !filterFunc(itemSnap, useNode(s, id, 'snap')) : false;
	} catch (e: any) {
		log.error('expansion filterFunc error', e);
		R.libs.mantine?.MantineError?.('Системная ошибка!', `expansion filterFunc error. ${e.message}`);
	}

	return disabled;
};

// Метод установки состояния иерархии.
const setHierarhyExpansion = (s: Store) => {
	if (s.tableProps.expansion.useHierarchy) {
		if (s.hierarchy.tableNode) {
			s.hierarchy.tableNode?.childNodes().forEach((childNode) => {
				if (childNode.itemId) childNode.states.expansion.value = s.expandedIds[childNode.itemId];
			});

			const rootNode = s.hierarchy.tableNode.rootNode();
			if (rootNode) Noodl.Events.emit(`${rootNode.path}_expansionChanged`);
		}
	}
};
