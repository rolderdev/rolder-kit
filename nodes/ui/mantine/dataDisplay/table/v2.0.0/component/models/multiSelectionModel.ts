/* Модель мульти-выбора. */

import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Store } from '../../node/store';
import type { TableRecord } from './itemModel';
import type { FrontItem } from '@shared/types-v0.1.0';
import type { CheckboxProps } from '@mantine/core';
import type { HierarchyItem } from '@nodes/use-data-v2.0.0';

type Selection = 'selected' | 'notSelected' | 'indeterminate';

export const setSelectedRecords = (s: Store, newSelectedRecords: TableRecord[], isDefault?: boolean) => {
	const { get, compare } = R.libs.just;

	//if (isDefault && s.tableProps.multiSelection.useHierarchy) setDefaultSelectionHierarchy(s);

	if (!compare(s.selectedRecords, newSelectedRecords)) {
		s.selectedRecords = newSelectedRecords;

		if (s.tableProps.multiSelection.useHierarchy) setSelectionHierarchy(s, newSelectedRecords);

		sendOutput(
			s.noodlNode,
			'selectedItems',
			newSelectedRecords.map((record) => get(s.items, record.id))
		);
		if (!isDefault) sendSignal(s.noodlNode, 'selectedItemsChanged');
	}
};

export const resetSelectedRecords = (s: Store) => {
	if (s.selectedRecords.length) {
		s.selectedRecords = [];
		sendOutput(s.noodlNode, 'selectedItems', []);
		sendSignal(s.noodlNode, 'selectedItemsChanged');
	}
};

const setSelectionHierarchy = (s: Store, selectedRecords: TableRecord[]) => {
	if (s.hierarchyNode) {
		const selectedIds = selectedRecords.map((i) => i.id);
		const currentTableNodes = s.hierarchyNode.descendants().filter((n) => s.records.map((i) => i.id).includes(n.data.id));

		// Пройдем по всем нодам и проставим состояние выбора текущей таблице.
		for (const currentTableNode of currentTableNodes) {
			let selection: Selection = currentTableNode.data.state.selection === 'indeterminate' ? 'indeterminate' : 'notSelected';
			if (selectedIds.includes(currentTableNode.data.id)) selection = 'selected';
			currentTableNode.data.state.selection = selection;
		}

		// Пройдем по всем наследникам, исключая ноды текущей таблицы, чтобы использовать indeterminate родителя.
		for (const currentTableNode of currentTableNodes) {
			// Возьмем всех наследников, исключив ноды текущей таблицы.
			for (const descendant of currentTableNode.descendants().filter((i) => i.data.id !== currentTableNode.data.id)) {
				const parentNode = descendant.parent;
				if (parentNode) {
					let selection: Selection = parentNode.data.state.selection;
					// Нужно не трогать полупокеров.
					if (selection === 'indeterminate') return;
					descendant.data.state.selection = selection;
				}
			}
		}

		// Возьмем всех предков из первой ноды, т.к. предки у всех нод текущей таблицы теже.
		// Найдем родителя первой ноды, чтобы взять его пердков, т.к. предки включают себя.
		const parentNode = currentTableNodes[0].parent;
		if (parentNode) {
			for (const ancestor of parentNode.ancestors()) {
				const childrenCount = ancestor.children?.length || 0;
				const selectedChildrenCount = ancestor.children?.filter((i) => i.data.state.selection === 'selected').length || 0;
				const indeterminateChildrenCount =
					ancestor.children?.filter((i) => i.data.state.selection === 'indeterminate').length || 0;
				// Если в детях есть полупокеры, то протягиваем его вверх, иначе определяем состояние по разнице.
				ancestor.data.state.selection = indeterminateChildrenCount
					? 'indeterminate'
					: childrenCount === selectedChildrenCount
					? 'selected'
					: selectedChildrenCount === 0
					? 'notSelected'
					: 'indeterminate';
			}
		}
	}
};

// Подменим параметры чекбокса, если используется иерархия и функция еще не определена.
// Подписывается на изменение выбора иерархии и проставляет его.
export const handleHierarchySelectionAndCheckboxProps = (s: Store, record: TableRecord, idx: number) => {
	const { useSnapshot, proxy, snapshot } = R.libs.valtio;

	const item = R.libs.just.get(s.items, record.id) as FrontItem | undefined;
	let checkBoxProps: CheckboxProps = {};

	if (item) {
		// Запустим функцию разработчика, если есть.
		checkBoxProps = s.libProps.getRecordSelectionCheckboxProps?.(item, idx) || {};

		// Подписка на иерархию и изменение выбора
		if (s.tableProps.multiSelection.useHierarchy && s.hierarchyNode) {
			const nodeState = s.hierarchyNode?.find((i) => i.data.id === item.id)?.data.state;
			const nodeStateSnap = useSnapshot(nodeState || proxy({} as HierarchyItem['state']));
			checkBoxProps.indeterminate = nodeStateSnap.selection === 'indeterminate';

			const filterFunc = s.tableProps.multiSelection.filterFunc;
			const selectedRecords = s.selectedRecords;

			if (!selectedRecords.map((i) => i.id).includes(item.id) && nodeStateSnap.selection === 'selected') {
				if (filterFunc) {
					if (filterFunc(snapshot(item))) s.selectedRecords.push({ id: item.id });
				} else s.selectedRecords.push({ id: item.id });
			}

			if (selectedRecords.map((i) => i.id).includes(item.id) && nodeStateSnap.selection !== 'selected') {
				if (filterFunc) {
					if (filterFunc(snapshot(item))) s.selectedRecords = selectedRecords.filter((i) => i.id !== item.id);
				} else s.selectedRecords = selectedRecords.filter((i) => i.id !== item.id);
			}
		}

		// Расчет отступа функцией разработчика.
		const paddingLeftPostion = s.tableProps.rowStyles.paddingLeftPostion;
		const level = s.level;
		const pl = s.tableProps.paddingLeftFunc?.(level, snapshot(item));
		checkBoxProps.pl = paddingLeftPostion === 'checkbox' ? pl : undefined;
	}

	return checkBoxProps;
};
