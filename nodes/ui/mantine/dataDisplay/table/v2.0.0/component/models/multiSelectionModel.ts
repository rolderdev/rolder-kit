/* Модель мульти-выбора. */

import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { CheckboxProps } from '@mantine/core';
import type { ItemSelectionState, SelectionState } from '@nodes/use-data-v2.0.0';
import type { Store } from '../../node/store';
import type { TableRecord } from './recordModel';

export const setSelectedIds = (s: Store, newSelectedRecords: TableRecord[], isDefault?: boolean) => {
	const { compare } = R.libs.just;
	const newSelectedIds = newSelectedRecords.map((i) => i.id);

	if (!compare(s.selectedIds.sort(), newSelectedIds.sort())) {
		s.selectedIds = newSelectedIds;

		if (s.tableProps.multiSelection.useHierarchy) setSelectionHierarchy(s, newSelectedIds);

		sendOutput(
			s.noodlNode,
			'selectedItems',
			newSelectedIds.map((id) => R.items.get(id))
		);
		if (!isDefault) sendSignal(s.noodlNode, 'selectedItemsChanged');
	}
};

export const resetSelectedIds = (s: Store) => {
	if (s.selectedIds.length) {
		s.selectedIds = [];
		if (s.tableProps.multiSelection.useHierarchy) setSelectionHierarchy(s, []);

		sendOutput(s.noodlNode, 'selectedItems', []);
		sendSignal(s.noodlNode, 'selectedItemsChanged');
	}
};

const setSelectionHierarchy = (s: Store, selectedIds: string[]) => {
	const currentTableItems = s.records.map((i) => R.items.get(i.id)).filter((i) => i !== undefined);

	// Проставим состояние выбора текущей таблице.
	for (const item of currentTableItems) {
		const itemState = item.getSelectionState();
		let selection: SelectionState = itemState.selection === 'indeterminate' ? 'indeterminate' : 'notSelected';
		if (selectedIds.includes(item.id)) selection = 'selected';
		itemState.selection = selection;
	}

	// Пройдем по всем наследникам, исключая текущую таблицу, чтобы использовать indeterminate родителя.
	for (const item of currentTableItems) {
		// Возьмем всех наследников, исключив текущую таблицу.
		for (const descendantItem of item.getDescendants({ skipSelf: true })) {
			const parentItem = descendantItem.getParant();
			if (parentItem) {
				const parentState = parentItem.getSelectionState();
				// Нужно не трогать полупокеров.
				if (parentState.selection !== 'indeterminate') {
					const descendantItemState = descendantItem.getSelectionState();
					descendantItemState.selection = parentState.selection;
				}
			}
		}
	}

	// Возьмем всех предков из первого item, т.к. предки у всех item текущей таблицы теже.
	const parentItem = Object.values(currentTableItems)[0].getParant();
	if (parentItem) {
		for (const ancestorItem of parentItem.getAncestors()) {
			const ancestorState = ancestorItem.getSelectionState();
			const childrenCount = ancestorItem.getChildren().length;
			const selectedChildrenCount = ancestorItem
				.getChildren()
				.filter((i) => i.getSelectionState().selection === 'selected').length;
			const indeterminateChildrenCount = ancestorItem
				.getChildren()
				.filter((i) => i.getSelectionState().selection === 'indeterminate').length;
			// Если в детях есть полупокер, то протягиваем его вверх, иначе определяем состояние по разнице.
			ancestorState.selection = indeterminateChildrenCount
				? 'indeterminate'
				: childrenCount === selectedChildrenCount
				? 'selected'
				: selectedChildrenCount === 0
				? 'notSelected'
				: 'indeterminate';
		}

		/* // Корень обработаем отдельно. Здесь специфика в том, что дети корня могут быть разных классов.
		const rootItem = Object.values(currentTableItems)[0].getRoot();
		// Вытянем класс корневой таблицы, чтобы понять каких детей корневой таблицы считать.
		const rootTableDbClass = R.libs.just.last(Object.values(currentTableItems)[0].getAncestors()).dbClass;
		const rootState = rootItem.getSelectionState();

		const childrenCount = rootItem.getChildren(rootTableDbClass).length;
		const selectedChildrenCount = rootItem
			.getChildren(rootTableDbClass)
			.filter((i) => i.getSelectionState().selection === 'selected').length;
		const indeterminateChildrenCount = rootItem
			.getChildren(rootTableDbClass)
			.filter((i) => i.getSelectionState().selection === 'indeterminate').length;
		console.log(childrenCount, selectedChildrenCount, indeterminateChildrenCount);
		rootState.selection = indeterminateChildrenCount
			? 'indeterminate'
			: childrenCount === selectedChildrenCount
			? 'selected'
			: selectedChildrenCount === 0
			? 'notSelected'
			: 'indeterminate'; */
	}
};

// Подменим параметры чекбокса, если используется иерархия и функция еще не определена.
// Подписывается на изменение выбора иерархии и проставляет его.
export const handleHierarchySelectionAndCheckboxProps = (s: Store, record: TableRecord, idx: number) => {
	const { useSnapshot, snapshot } = R.libs.valtio;

	const item = R.items.get(record.id);
	let checkBoxProps: CheckboxProps = {};

	if (item) {
		// Запустим функцию разработчика, если есть.
		checkBoxProps = s.libProps.getRecordSelectionCheckboxProps?.(item, idx) || {};

		// Подписка на иерархию и изменение выбора
		if (s.tableProps.multiSelection.useHierarchy) {
			const itemStateSnap = useSnapshot(item.getSelectionState());
			checkBoxProps.indeterminate = itemStateSnap.selection === 'indeterminate';

			const filterFunc = s.tableProps.multiSelection.filterFunc;
			const selectedIds = s.selectedIds;

			if (!selectedIds.includes(item.id) && itemStateSnap.selection === 'selected') {
				if (filterFunc) {
					if (filterFunc(snapshot(item))) s.selectedIds.push(item.id);
				} else s.selectedIds.push(item.id);
			}

			if (selectedIds.includes(item.id) && itemStateSnap.selection !== 'selected') {
				if (filterFunc) {
					if (filterFunc(snapshot(item))) s.selectedIds = selectedIds.filter((id) => id !== item.id);
				} else s.selectedIds = selectedIds.filter((id) => id !== item.id);
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

export const useHeaderCheckboxProps = (s: Store) => {
	// Вернем только параметры, установленные разработчиком или пустые параметры, когда хук не нужен.
	if (!s.tableProps.multiSelection.enabled || s.isChild || !s.tableProps.multiSelection.useHierarchy)
		return s.libProps.allRecordsSelectionCheckboxPropsDev || {};

	const { useSnapshot, proxy } = R.libs.valtio;
	// Если разработчик указал параметры, возьмем их.
	const checkBoxProps: CheckboxProps = s.libProps.allRecordsSelectionCheckboxPropsDev || {};
	// Найдем состояние выбора rootItem.
	const selectionState = R.items.get(s.records[0]?.id)?.getRoot()?.getSelectionState();
	// Подпишемся его изменения.
	const selectionSnap = useSnapshot(selectionState || proxy({} as ItemSelectionState));
	checkBoxProps.indeterminate = selectionSnap.selection === 'indeterminate';

	return checkBoxProps;
};
