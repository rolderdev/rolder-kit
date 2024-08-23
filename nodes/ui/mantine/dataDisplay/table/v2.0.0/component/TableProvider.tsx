import { createContext, useEffect, useImperativeHandle } from 'react';
import { forwardRef } from 'react';
import type { Props } from '../types';
import type { Store } from '../node/store';
import Table from './Table';
import { setLibProps } from './models/libPropsModel';
import { setTableProps } from './models/tablePropsModel';
import { setColumnsDefinition } from './models/columnModel';
import { setItems } from './models/itemModel';
import { resetSelectedItem, setSelectedItem } from './models/singleSelectionModel';
import { resetSelectedRecords, setSelectedRecords } from './models/multiSelectionModel';
import { setExpandedIds } from './models/expansionModel';

import 'mantine-datatable/styles.css';
export const TableContext = createContext<Store>({} as any);

export default forwardRef(function (p: Props, ref) {
	const { useSnapshot, ref: vRef } = R.libs.valtio;

	const store = p.store;
	const snap = useSnapshot(p.store);

	useEffect(() => {
		// Параметры иерархии.
		// metaData записывается в родителе, когда тот создает расширяемые строки.
		const parentMetaData = p.noodlNode.nodeScope.componentOwner.metaData;
		if (parentMetaData) {
			store.tableId = parentMetaData.id; // id родительского item.
			store.level = parentMetaData.level + 1;
			store.isChild = true;
		} else store.tableId = R.libs.nanoid(6);
	}, []);

	// Реактивность на изменение инпутов.
	useEffect(() => {
		if (p.hierarchyNode) store.hierarchyNode = vRef(p.hierarchyNode);
		setColumnsDefinition(p);
		setItems(p);
		setTableProps(p);

		if (!snap.inited) {
			// Установка дефолтов.
			if (store.defaults.selectedItem) setSelectedItem(store, store.defaults.selectedItem.id, true);
			if (store.defaults.selectedItems) setSelectedRecords(store, store.defaults.selectedItems, true);
			if (store.defaults.expandedItems) setExpandedIds(store, store.defaults.expandedItems, true);

			// В конце, т.к. есть зависимости от дефолтов.
			setLibProps(p);
			store.inited = true;
		} else setLibProps(p);

		if (p.items && snap.fetching) store.fetching = false;
	}, [p]);

	// Входящие сигналы.
	useImperativeHandle(
		ref,
		() => ({
			setSelectedItem: (p: Props) => p.selectedItem && setSelectedItem(store, p.selectedItem.id),
			resetSelectedItem: () => resetSelectedItem(store),
			setSelectedItems: (p: Props) =>
				p.selectedItems &&
				setSelectedRecords(
					store,
					store.records.filter((i) => p.selectedItems?.map((i) => i.id).includes(i.id))
				),
			resetSelectedItems: () => resetSelectedRecords(store),
			setExpandedItems: (p: Props) => p.expandedItems && setExpandedIds(store, p.expandedItems),
			expandAll: () => p.items && setExpandedIds(store, p.items),
			collapseAll: () => p.items && setExpandedIds(store, []),
		}),
		[store]
	);

	return snap.inited ? (
		<TableContext.Provider value={store}>
			<Table />
		</TableContext.Provider>
	) : null;
});
