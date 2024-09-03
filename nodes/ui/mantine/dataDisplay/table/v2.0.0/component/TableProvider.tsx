import { createContext, useEffect, useImperativeHandle } from 'react';
import { forwardRef } from 'react';
import type { Props } from '../node/definition';
import type { Store } from '../node/store';
import Table from './Table';
import { setLibProps } from './models/libPropsModel';
import { setTableProps } from './models/tablePropsModel';
import { setColumnsDefinition } from './models/columnModel';
import { setRecordIds } from './models/recordModel';
import { resetSelectedId, setSelectedId } from './models/singleSelectionModel';
import { setSelectedIds } from './models/multiSelectionModel';
import { setExpandedIds } from './models/expansionModel';

import 'mantine-datatable/styles.css';
export const TableContext = createContext<Store>({} as any);

export default forwardRef(function (p: Props, ref) {
	const { useSnapshot } = R.libs.valtio;

	const store = p.store;
	const snap = useSnapshot(p.store);

	useEffect(() => {
		// Параметры иерархии.
		// metaData записывается в родителе, когда тот создает расширяемые строки.
		const parentMetaData = p.noodlNode.nodeScope.componentOwner.metaData;
		if (parentMetaData)
			store.hierarchy = {
				isChild: true,
				level: parentMetaData.level + 1,
				tableNodePath: parentMetaData.nodePath,
				tableNode: R.nodes.get(parentMetaData.nodePath),
			};
		else
			store.hierarchy = {
				isChild: false,
				level: 0,
				tableNodePath: p.rootNodeId,
				tableNode: p.rootNodeId ? R.nodes.get(p.rootNodeId) : undefined,
			};
	}, [p.rootNodeId]);

	// Реактивность на изменение инпутов.
	useEffect(() => {
		setColumnsDefinition(p);
		setRecordIds(p);
		setLibProps(p);
		setTableProps(p);

		if (!snap.inited) {
			// Установка дефолтов.
			if (store.defaults.selectedId) setSelectedId(store, store.defaults.selectedId, true);
			if (store.defaults.selectedIds)
				setSelectedIds(
					store,
					store.defaults.selectedIds.map((i) => ({ id: i })),
					true
				);
			if (store.defaults.expandedIds) setExpandedIds(store, store.defaults.expandedIds, true);

			store.inited = true;
		}

		if (p.items && snap.fetching) store.fetching = false;
	}, [p]);

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

	return snap.inited ? (
		<TableContext.Provider value={store}>
			<Table />
		</TableContext.Provider>
	) : null;
});
