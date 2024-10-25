import { createContext, useEffect, useImperativeHandle, useState } from 'react'
import { forwardRef } from 'react'
import type { Props } from '../node/definition'
import Table from './Table'
import { setColumnsDefinition } from './models/column'
import { setExpandedIds } from './models/expansion'
import { setInitialFiltersState, useFiltersValue, useHierarchyFiltersValue } from './models/filter'
import { setLibProps } from './models/libProps'
import { setSelectedIds } from './models/multiSelection'
import { setRecordIds } from './models/record'
import { resetSelectedId, setSelectedId, useHierarhySingleSelection } from './models/singleSelection'
import { setSortState, useHierarchySortState } from './models/sort'
import { setTableProps } from './models/tableProps'
import getStore, { type Store } from './store'

import 'mantine-datatable/styles.css'

export const TableContext = createContext<Store>({} as any)

export default forwardRef((p: Props, ref) => {
	const { useSnapshot } = R.libs.valtio

	const [s] = useState(getStore(p.noodlNode))

	const snap = useSnapshot(s)

	// Подчистим стостояния таблицы и ее дете в иерархии при демонтировании.
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		return () => {
			if (!s.hierarchy.isChild && s.hierarchy.tableNode)
				for (const node of s.hierarchy.tableNode.rootNode().descendantNodes()) {
					node.states = {
						singleSelection: { value: null },
						multiSelection: { value: 'notSelected' },
						expansion: { value: false },
						sort: { value: { direction: 'asc' } },
						filters: { value: {} },
					}
				}
		}
	}, [])

	useEffect(() => {
		// Параметры иерархии.
		// metaData записывается в родителе, когда тот создает расширяемые строки.
		const parentMetaData = p.noodlNode.nodeScope.componentOwner.metaData
		if (parentMetaData)
			s.hierarchy = {
				isChild: true,
				level: parentMetaData.level + 1,
				tableNodePath: parentMetaData.nodePath,
				tableNode: R.nodes[parentMetaData.nodePath],
			}
		else
			s.hierarchy = {
				isChild: false,
				level: 0,
				tableNodePath: p.rootNodeId,
				tableNode: p.rootNodeId ? R.nodes[p.rootNodeId] : undefined,
			}
	}, [s, p.rootNodeId, p.noodlNode.nodeScope.componentOwner.metaData])

	// Реактивность на изменение инпутов.
	useEffect(() => {
		setColumnsDefinition(p, s)
		setRecordIds(p, s)
		setLibProps(p, s)
		setTableProps(p, s)

		// Инициализация фильтрации.

		setInitialFiltersState(s, p.items || [])
		//if (!s.filters.state) setInitialFiltersState(s, p.items || [])

		if (!snap.inited) {
			// Дефолты с входов при монтировании.
			if (p.defaultSelectedItem?.id) setSelectedId(s, p.defaultSelectedItem?.id, true)
			const defaultSelectedRecords = p.defaultSelectedItems?.map((item) => ({ id: item.id })) || []
			if (defaultSelectedRecords.length) setSelectedIds(s, defaultSelectedRecords, true)
			const defaultExpandedIds = p.defaultExpandedItems?.map((item) => item.id) || []
			if (defaultExpandedIds.length) setExpandedIds(s, defaultExpandedIds, true)

			s.inited = true
		}

		// Дефолтная сортировка. Нужно обращаться к store, т.к. snap батчится.
		if (s.tableProps.sort.enabled && s.tableProps.sort.defaultState && p.items?.length)
			setSortState(s, s.sort.state || s.tableProps.sort.defaultState, true)

		s.fetching = p.fetching
	}, [p, s, snap.inited, p.fetching])

	// Подписка на изменение выбранного item в иерархии.
	useHierarhySingleSelection(s)
	// Подписка на состояние сортировки в иерархии.
	useHierarchySortState(s)
	// Подписка на изменение значений фильтров.
	useFiltersValue(s)
	useHierarchyFiltersValue(s)

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
		[s, p]
	)

	//console.log('Table provider', snap.hierarchy);
	return snap.inited ? (
		<TableContext.Provider value={s}>
			<Table />
		</TableContext.Provider>
	) : null
})
