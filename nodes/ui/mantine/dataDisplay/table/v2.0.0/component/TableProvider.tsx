import { createContext, useEffect, useImperativeHandle, useState } from 'react';
import { forwardRef } from 'react';
import type { Props } from '../node/definition';
import getStore, { type Store } from './store';
import Table from './Table';
import { setLibProps } from './models/libProps';
import { setTableProps } from './models/tableProps';
import { setColumnsDefinition } from './models/column';
import { setRecordIds } from './models/record';
import { resetSelectedId, setSelectedId, useHierarhySingleSelection } from './models/singleSelection';
import { setSelectedIds } from './models/multiSelection';
import { setExpandedIds } from './models/expansion';
import { setSortState } from './models/sort';
import { setInitialFiltersState, useFiltersValue } from './models/filter';

import 'mantine-datatable/styles.css';

export const TableContext = createContext<Store>({} as any);

export default forwardRef(function (p: Props, ref) {
	const { useSnapshot } = R.libs.valtio;

	const [s] = useState(getStore(p.noodlNode));

	const snap = useSnapshot(s);

	// Подчистим стостояния таблицы и ее дете в иерархии при демонтировании.
	useEffect(() => {
		return () => {
			if (!s.hierarchy.isChild && s.hierarchy.tableNode)
				s.hierarchy.tableNode
					.rootNode()
					.descendantNodes()
					.forEach((node) => {
						node.states = {
							singleSelection: { value: null },
							multiSelection: { value: 'notSelected' },
							expansion: { value: false },
						};
					});
		};
	}, []);

	useEffect(() => {
		// Параметры иерархии.
		// metaData записывается в родителе, когда тот создает расширяемые строки.
		const parentMetaData = p.noodlNode.nodeScope.componentOwner.metaData;
		if (parentMetaData)
			s.hierarchy = {
				isChild: true,
				level: parentMetaData.level + 1,
				tableNodePath: parentMetaData.nodePath,
				tableNode: R.nodes[parentMetaData.nodePath],
			};
		else
			s.hierarchy = {
				isChild: false,
				level: 0,
				tableNodePath: p.rootNodeId,
				tableNode: p.rootNodeId ? R.nodes[p.rootNodeId] : undefined,
			};
	}, [p.rootNodeId]);

	// Реактивность на изменение инпутов.
	useEffect(() => {
		setColumnsDefinition(p, s);
		setRecordIds(p, s);
		setLibProps(p, s);
		setTableProps(p, s);

		// Дефолтная сортировка. Нужно обращаться к store, т.к. snap батчится.
		if (s.tableProps.sort.enabled && s.tableProps.sort.defaultState && !s.sortState)
			setSortState(s, s.tableProps.sort.defaultState, true);

		// Инициализация фильтрации.
		if (!s.filtersState) setInitialFiltersState(s, p.items || []);

		if (!snap.inited) {
			// Дефолты с входов при монтировании.
			if (p.defaultSelectedItem?.id) setSelectedId(s, p.defaultSelectedItem?.id, true);
			const defaultSelectedRecords = p.defaultSelectedItems?.map((item) => ({ id: item.id })) || [];
			if (defaultSelectedRecords.length) setSelectedIds(s, defaultSelectedRecords, true);
			const defaultExpandedIds = p.defaultExpandedItems?.map((item) => item.id) || [];
			if (defaultExpandedIds.length) setExpandedIds(s, defaultExpandedIds, true);

			s.inited = true;
		}
		s.fetching = !!p.fetching;
	}, [p]);

	// Подписка на изменение выбранного item в иерархии.
	useHierarhySingleSelection(s);
	// Подписка на изменение значений фильтров.
	useFiltersValue(s, p.items || []);

	// Входящие сигналы.
	useImperativeHandle(
		ref,
		() => ({
			setSelectedItem: (p: Props) => p.selectedItem && setSelectedId(s, p.selectedItem.id),
			resetSelectedItem: () => resetSelectedId(s),
			setSelectedItems: (p: Props) =>
				p.selectedItems &&
				setSelectedIds(
					s,
					s.records.filter((i) => p.selectedItems?.map((i) => i.id).includes(i.id))
				),
			resetSelectedItems: () => setSelectedIds(s, []),
			setExpandedItems: (p: Props) =>
				p.expandedItems &&
				setExpandedIds(
					s,
					p.expandedItems.map((i) => i.id)
				),
			expandAll: () =>
				p.items &&
				setExpandedIds(
					s,
					p.items.map((i) => i.id)
				),
			collapseAll: () => setExpandedIds(s, []),
		}),
		[s]
	);

	//console.log('Table provider', snap.hierarchy);
	return snap.inited ? (
		<TableContext.Provider value={s}>
			<Table />
		</TableContext.Provider>
	) : null;
});
