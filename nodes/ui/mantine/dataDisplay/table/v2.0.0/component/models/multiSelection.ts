/* Модель мульти-выбора. */

import { useEffect } from 'react';
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { MultiSelection } from '@nodes/use-data-v2.0.0';
import Node from '@nodes/use-data-v2.0.0/component/Node';
import type { Snap, Store } from '../../node/store';
import type { TableRecord } from './record';
import useItem from '../funcs/useItem';
import useNode from '../funcs/useNode';

export const setSelectedIds = (s: Store, newSelectedRecords: TableRecord[], isDefault?: boolean) => {
	const { compare } = R.libs.just;
	const newSelectedIds = newSelectedRecords.map((i) => i.id);
	const selectedIds = Object.keys(s.selectedIds).filter((id) => s.selectedIds[id]);

	if (!compare(selectedIds.sort(), newSelectedIds.sort())) {
		s.selectedIds = {};
		newSelectedIds.map((id) => (s.selectedIds[id] = true));

		if (s.tableProps.multiSelection.useHierarchy) setSelectionHierarchy(s, newSelectedIds);

		sendOutput(
			s.noodlNode,
			'selectedItems',
			newSelectedIds.map((id) => R.items[id])
		);
		if (!isDefault) sendSignal(s.noodlNode, 'selectedItemsChanged');
	}
};

const setSelectionHierarchy = (s: Store, selectedIds: string[]) => {
	const currentTableNodes = s.records.map((i) => useNode(s, i.id, 'store')).filter((i) => i !== undefined) as Node[];

	// Проставим состояние выбора текущей таблице.
	for (const node of currentTableNodes) {
		if (node.itemId) {
			const selectionState = node.states.multiSelection;
			let selection: MultiSelection = selectionState.value === 'indeterminate' ? 'indeterminate' : 'notSelected';
			if (selectedIds.includes(node.itemId)) selection = 'selected';
			selectionState.value = selection;
		}
	}

	// Пройдем по всем наследникам, исключая текущую таблицу, чтобы использовать indeterminate родителя.
	for (const node of currentTableNodes) {
		// Возьмем всех наследников, исключив текущую таблицу.
		for (const descendantNode of node.descendantNodes()) {
			const parentNode = descendantNode.parentNode();
			if (parentNode) {
				const parentState = parentNode.states.multiSelection;
				// Нужно не трогать полупокеров.
				if (parentState?.value !== 'indeterminate') {
					const descendantItemState = descendantNode.states.multiSelection;
					if (parentState && descendantItemState) descendantItemState.value = parentState.value;
				}
			}
		}
	}

	// Возьмем всех предков ноды таблицы, включая ее саму.
	const tableNode = s.hierarchy.tableNode;
	if (tableNode) {
		for (const ancestorNode of tableNode.ancestorNodes(true)) {
			const ancestorState = ancestorNode.states.multiSelection;
			if (ancestorState) {
				const childrenCount = ancestorNode.childNodes().length;
				const selectedChildrenCount = ancestorNode
					.childNodes()
					.filter((i) => i.states.multiSelection.value === 'selected').length;
				const indeterminateChildrenCount = ancestorNode
					.childNodes()
					.filter((i) => i.states.multiSelection.value === 'indeterminate').length;
				// Если в детях есть полупокер, то протягиваем его вверх, иначе определяем состояние по разнице.
				ancestorState.value = indeterminateChildrenCount
					? 'indeterminate'
					: childrenCount === selectedChildrenCount
					? 'selected'
					: selectedChildrenCount === 0
					? 'notSelected'
					: 'indeterminate';
			}
		}
	}

	// Сообщим useData, что выбор изменился.
	const rootNode = currentTableNodes[0]?.rootNode();
	if (rootNode) Noodl.Events.emit(`${rootNode.path}_multiSelectionChanged`);
};

// Подменим параметры чекбокса и сделаем выбор в иерархии реактивным.
export const useHierarchySelection = (s: Store) => {
	const { get, set } = R.libs.just;
	const { subscribeKey } = R.libs.valtio;

	useEffect(() => {
		// Реактивность состояния чекбокса в заголовке.
		if (!s.hierarchy.isChild && !get(s.checkboxes, ['unsubs', 'header'])) {
			const tableNode = s.hierarchy.tableNode;
			if (tableNode) {
				const unsub = subscribeKey(tableNode.states.multiSelection, 'value', (selection) => {
					let newCheckBoxProps = s.libProps.allRecordsSelectionCheckboxPropsDev || {};
					newCheckBoxProps = { ...newCheckBoxProps, indeterminate: selection === 'indeterminate' };
					set(s.checkboxes, ['props', 'header'], newCheckBoxProps);
				});

				set(s.checkboxes, ['unsubs', 'header'], unsub);
			}
		}

		// Реактивность состояния чекбоксов строк.
		s.records.map((record, idx) => {
			const node = useNode(s, record.id, 'store');
			if (node && !get(s.checkboxes, ['unsubs', record.id])) {
				setRowSelection(s, record.id, idx);
				const unsub = subscribeKey(node.states.multiSelection, 'value', () => setRowSelection(s, record.id, idx));

				set(s.checkboxes, ['unsubs', record.id], unsub);
			}
		});
	}, [s.records.map((i) => i.id)]);

	// Отписка при демонтировании таблицы.
	useEffect(() => {
		() => Object.values(s.checkboxes.unsubs).forEach((i) => i());
	}, []);
};

const setRowSelection = (s: Store, id: string, idx: number) => {
	try {
		const nodeSnap = useNode(s, id, 'snap');
		const itemSnap = useItem(id, 'snap');
		const selection = nodeSnap?.states.multiSelection.value;

		if (nodeSnap && itemSnap) {
			let newCheckBoxProps = s.libProps.getRecordSelectionCheckboxProps?.(itemSnap, idx) || {};

			// Расчет отсупа функцией разработчика.
			try {
				const paddingLeftPostion = s.tableProps.rowStyles.paddingLeftPostion;
				const level = s.hierarchy.level;
				const pl = s.tableProps.paddingLeftFunc?.(level, itemSnap);
				if (paddingLeftPostion === 'checkbox') newCheckBoxProps.pl = pl;
			} catch (e: any) {
				log.error('paddingLeftFunc error', e);
				R.libs.mantine?.MantineError?.('Системная ошибка!', `paddingLeftFunc error. ${e.message}`);
			}

			newCheckBoxProps = { ...newCheckBoxProps, indeterminate: nodeSnap.states.multiSelection.value === 'indeterminate' };
			R.libs.just.set(s.checkboxes, ['props', id], newCheckBoxProps);

			// Реактивность на измение выбора в иерархии.
			try {
				const filterFunc = s.tableProps.multiSelection.filterFunc;
				const selectedIds = s.selectedIds;

				if (!selectedIds[itemSnap.id] && selection === 'selected') {
					if (filterFunc) {
						if (filterFunc(itemSnap, nodeSnap)) s.selectedIds[itemSnap.id] = true;
					} else s.selectedIds[itemSnap.id] = true;
				}

				if (selectedIds[itemSnap.id] && selection !== 'selected') {
					if (filterFunc) {
						if (filterFunc(itemSnap, nodeSnap)) s.selectedIds[itemSnap.id] = false;
					} else s.selectedIds[itemSnap.id] = false;
				}
			} catch (e: any) {
				log.error('multiSelection filterFunc error', e);
				R.libs.mantine?.MantineError?.('Системная ошибка!', `multiSelection filterFunc error. ${e.message}`);
			}
		}
	} catch (e: any) {
		log.error('getRecordSelectionCheckboxProps error', e);
		R.libs.mantine?.MantineError?.('Системная ошибка!', `getRecordSelectionCheckboxProps error. ${e.message}`);
	}
};

export const handleRecordSelection = (s: Store, snap: Snap, recordId: string) => {
	const filterFunc = s.tableProps.multiSelection.filterFunc;
	if (filterFunc) {
		snap.checkboxes.hasChildren[recordId]; // Тригер для варианта, когда дети появились.
		const isSelectable = filterFunc(useItem(recordId, 'snap'), useNode(s, recordId, 'snap'));
		if (!isSelectable && s.selectedIds[recordId]) {
			const selectedRecords = Object.keys(s.selectedIds)
				.filter((id) => s.selectedIds[id] && id !== recordId)
				.map((id) => ({ id }));
			setSelectedIds(s, selectedRecords);
		}

		return isSelectable;
	}

	return true;
};
