/* Модель расширяемых строк. */

import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Store } from '../../node/store';

export type ExpansionRows = Record<string, React.ReactNode>;

// Метод установки состояния развернутой строки по клику на строку или шеврон.
export const toggleRowExpansion = (s: Store, id: string) => {
	const item = R.items.get(id);

	const filterFunc = s.tableProps.expansion.filterFunc;
	if (item && filterFunc && !filterFunc(R.libs.valtio.snapshot(item))) return;

	if (s.tableProps.expansion.allowMultiple) {
		if (s.expandedIds.includes(id)) s.expandedIds = s.expandedIds.filter((i) => i !== id);
		else s.expandedIds.push(id);
	} else {
		if (s.expandedIds.includes(id)) s.expandedIds = [];
		else s.expandedIds = [id];
	}

	sendOutput(
		s.noodlNode,
		'expandedItems',
		s.expandedIds.map((id) => R.items.get(id))
	);
	sendSignal(s.noodlNode, 'expandedItemsChanged');
};

// Метод установки новых строк с порта. Не срабатывает, если undefined.
// На уровне порта проверяется, что нельзя подать массив с несколькими items, если allowMultiple = false.
export const setExpandedIds = (s: Store, expandedIds: string[], isDefault?: boolean) => {
	const { compare } = R.libs.just;

	// Отфильтруем по items этой таблицы.
	const newExpandedIds = expandedIds.filter((id) => s.records.map((i) => i.id).includes(id));

	if (!compare(s.expandedIds.sort(), newExpandedIds.sort())) {
		s.expandedIds = newExpandedIds;

		sendOutput(
			s.noodlNode,
			'expandedItems',
			newExpandedIds.map((id) => R.items.get(id))
		);
		if (!isDefault) sendSignal(s.noodlNode, 'expandedItemsChanged');
	}
};
