/* Провайдер. Отделяет одну таблицу от другой. Обслуживает внешние сигналы. */

import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { nanoid } from 'nanoid';
import { getCompProps } from '@packages/get-comp-props';
import { useTableScopeStore } from '@packages/table-scope-v0.1.0/src/store';
import type { Props } from './types';
import { Provider, type Store } from './src/store/store';
import TableInstance from './src/TableInstance';
import { resetSelectedItem, setSelectedItem } from './src/models/singleSelectionModel';
import { resetSelectedItems, setSelectedItemsFromPort } from './src/models/multiSelectionModel';
import { resetExpandedItems, setExpandedItems } from './src/models/expansionModel';

// Стили загружаем здесь, чтобы разные TableInstance использовали уже загржунный css.
import '@mantine/core/styles/Table.css';
import 'mantine-datatable/styles.css';

export default forwardRef((props: Props, ref) => {
	// Даем разработчику извращаться, если он смелый.
	const p: Props = getCompProps(props);
	// Отменяем все, если нет колонок.
	if (!p.columnsDefinition?.length) return;

	// Определяем дочерняя ли таблица и тянем tableId, если он был создан при генерации расширяемых строк в родительской таблице,
	// иначе сгенерируем tableId.
	const { tableId, isChild } = useMemo(
		() => ({
			tableId: props.noodlNode.nodeScope.componentOwner.fid || nanoid(8),
			isChild: props.noodlNode.nodeScope.componentOwner.fid ? true : false,
		}),
		[]
	);

	// Внешние сигналы. TableInstance возвращает store через useImperativeHandle.
	const storeRef = useRef<{ store: Store }>(null);
	useImperativeHandle(
		ref,
		() => {
			const s = storeRef.current?.store;
			return {
				setSelectedItem() {
					if (s && p.selectedItem) setSelectedItem(s, p.selectedItem);
				},
				resetSelectedItem() {
					if (s) resetSelectedItem(s);
				},
				setSelectedItems() {
					if (s && p.selectedItems) setSelectedItemsFromPort(s, p.selectedItems);
				},
				resetSelectedItems() {
					if (s) resetSelectedItems(s);
				},
				setExpandedItems() {
					if (s && p.expandedItems) setExpandedItems(s, p.expandedItems);
				},
				expandAll() {
					if (s && p.items) setExpandedItems(s, p.items);
				},
				unexpandAll() {
					if (s) resetExpandedItems(s);
				},
				resetSort() {
					//if (s) s.sortState.set(undefined);
				},
				restoreDefaultSort() {
					//if (s) setDefaultSortState(s);
				},
			};
		},
		[p]
	);

	// Подключим TableScope если есть.
	const tableScopeStore = useTableScopeStore();

	console.log('TableProvider run', isChild, tableId, p.noodlNode.id); // Считаем запуски пока разрабатываем

	// Первичное состояние. Добавим параметры, которые не меняются и удобнее определить здесь.
	// Не будем сохранять scopeStore, когда он есть, но разработчик не включил его.
	// Добавим уровень для детей, если есть иерархия, оставив 0 для корня.
	return (
		<Provider
			initialState={{
				noodlNode: p.noodlNode,
				tableId,
				isChild,
				scopeStore: p.scopeDbClass ? tableScopeStore : undefined,
				level: tableScopeStore ? tableScopeStore.hierarchy.get((s) => s?.find((i) => i.data.fid === tableId)?.depth) || 0 : 0,
			}}
		>
			<TableInstance {...p} ref={storeRef} />
		</Provider>
	);
});
