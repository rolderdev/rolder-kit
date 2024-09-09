/* Модель расширяемых строк. */

import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Store } from '../../node/store';

export type ExpansionRows = Record<string, React.ReactNode>;

// Метод установки состояния развернутой строки по клику на строку или шеврон.
export const toggleRowExpansion = (s: Store, id: string) => {
	if (s.expandedIds[id]) s.expandedIds[id] = false;
	else s.expandedIds[id] = true;

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

	// Отфильтруем по items этой таблицы.
	const newExpandedIds = expandedIds.filter((id) => s.records.map((i) => i.id).includes(id));
	const expendedIds = Object.keys(s.expandedIds).filter((id) => s.expandedIds[id]);

	if (!compare(expendedIds.sort(), newExpandedIds.sort())) {
		s.expandedIds = {};
		newExpandedIds.map((id) => (s.expandedIds[id] = true));

		sendOutput(
			s.noodlNode,
			'expandedItems',
			newExpandedIds.map((id) => R.items[id])
		);
		if (!isDefault) sendSignal(s.noodlNode, 'expandedItemsChanged');
	}
};
