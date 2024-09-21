import { createContext, useEffect, useImperativeHandle } from 'react';
import { forwardRef } from 'react';
import type { Props } from '../node/definition';
import type { Store } from '../node/store';
import Table from './Table';
import { setLibProps } from './models/libProps';
import { setTableProps } from './models/tableProps';
import { setColumnsDefinition } from './models/column';
import { setRecordIds } from './models/record';
import { resetSelectedId, setSelectedId, useHierarhySingleSelection } from './models/singleSelection';
import { setSelectedIds } from './models/multiSelection';
import { setExpandedIds } from './models/expansion';

import 'mantine-datatable/styles.css';
import { setSortState } from './models/sort';
export const TableContext = createContext<Store>({} as any);

export default forwardRef(function (p: Props, ref) {
	const { useSnapshot } = R.libs.valtio;

	const store = p.store;
	const snap = useSnapshot(p.store);

	// Дефолты с входов при монтировании.
	useEffect(() => {
		if (p.defaultSelectedItem?.id) setSelectedId(store, p.defaultSelectedItem?.id, true);
		const defaultSelectedRecords = p.defaultSelectedItems?.map((item) => ({ id: item.id })) || [];
		if (defaultSelectedRecords.length) setSelectedIds(store, defaultSelectedRecords, true);
		const defaultExpandedIds = p.defaultExpandedItems?.map((item) => item.id) || [];
		if (defaultExpandedIds.length) setExpandedIds(store, defaultExpandedIds, true);
	}, []);

	useEffect(() => {
		// Параметры иерархии.
		// metaData записывается в родителе, когда тот создает расширяемые строки.
		const parentMetaData = p.noodlNode.nodeScope.componentOwner.metaData;
		if (parentMetaData)
			store.hierarchy = {
				isChild: true,
				level: parentMetaData.level + 1,
				tableNodePath: parentMetaData.nodePath,
				tableNode: R.nodes[parentMetaData.nodePath],
			};
		else
			store.hierarchy = {
				isChild: false,
				level: 0,
				tableNodePath: p.rootNodeId,
				tableNode: p.rootNodeId ? R.nodes[p.rootNodeId] : undefined,
			};
	}, [p.rootNodeId]);

	// Реактивность на изменение инпутов.
	useEffect(() => {
		setColumnsDefinition(p);
		setRecordIds(p);
		setLibProps(p);
		setTableProps(p);

		// Дефолтная сортировка. Нужно обращаться к store, т.к. snap батчится.
		if (store.tableProps.sort.enabled && store.tableProps.sort.defaultState && !store.sortState)
			setSortState(store, store.tableProps.sort.defaultState, true);

		if (!snap.inited) store.inited = true;
		store.fetching = !!p.fetching;
	}, [p]);

	// Подписка на изменение выбранного item в иерархии.
	useHierarhySingleSelection(store);

	// Входящие сигналы.
	useImperativeHandle(
		ref,
		() => ({
			setSelectedItem: (p: Props) => p.selectedItem && setSelectedId(store, p.selectedItem.id),
			resetSelectedItem: () => resetSelectedId(store),
			setSelectedItems: (p: Props) =>
				p.selectedItems &&
				setSelectedIds(
					store,
					store.records.filter((i) => p.selectedItems?.map((i) => i.id).includes(i.id))
				),
			resetSelectedItems: () => setSelectedIds(store, []),
			setExpandedItems: (p: Props) =>
				p.expandedItems &&
				setExpandedIds(
					store,
					p.expandedItems.map((i) => i.id)
				),
			expandAll: () =>
				p.items &&
				setExpandedIds(
					store,
					p.items.map((i) => i.id)
				),
			collapseAll: () => setExpandedIds(store, []),
		}),
		[store]
	);

	//console.log('Table provider', snap.hierarchy);
	return snap.inited ? (
		<TableContext.Provider value={store}>
			<Table />
		</TableContext.Provider>
	) : null;
});
