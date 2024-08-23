/* Модель расширяемых строк. */

import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Store } from '../../node/store';
import type { FrontItem } from '@shared/types-v0.1.0';

export type ExpansionRows = Record<string, React.ReactNode>;

// Метод установки состояния развернутой строки по клику на строку или шеврон.
export const toggleRowExpansion = (s: Store, itemId: string) => {
	const { get } = R.libs.just;

	const item = get(s.items, itemId);

	const filterFunc = s.tableProps.expansion.filterFunc;
	const hierarchyNode = s.hierarchyNode?.find((i) => i.data.id === item.id);
	if (filterFunc && !filterFunc(R.libs.valtio.snapshot(item), hierarchyNode)) return;

	if (s.tableProps.expansion.allowMultiple) {
		if (s.expandedIds.includes(itemId)) s.expandedIds = s.expandedIds.filter((i) => i !== itemId);
		else s.expandedIds.push(itemId);
	} else {
		if (s.expandedIds.includes(itemId)) s.expandedIds = [];
		else s.expandedIds = [itemId];
	}

	sendOutput(
		s.noodlNode,
		'expandedItems',
		s.expandedIds.map((id) => get(s.items, id))
	);
	sendSignal(s.noodlNode, 'expandedItemsChanged');
};

// Метод установки новых строк с порта. Не срабатывает, если undefined.
// На уровне порта проверяется, что нельзя подать массив с несколькими items, если allowMultiple = false.
export const setExpandedIds = (s: Store, newExpandedItems: FrontItem[], isDefault?: boolean) => {
	const { has, get, compare } = R.libs.just;

	let newExpandedIds = [];
	// Отфильтруем подынные items по items этой таблицы.
	for (const item of newExpandedItems) {
		if (has(s.items, item.id)) newExpandedIds.push(item.id);
	}

	if (!compare(s.expandedIds, newExpandedIds)) {
		s.expandedIds = newExpandedIds;

		sendOutput(
			s.noodlNode,
			'expandedItems',
			newExpandedIds.map((id) => get(s.items, id))
		);
		if (!isDefault) sendSignal(s.noodlNode, 'expandedItemsChanged');
	}
};
