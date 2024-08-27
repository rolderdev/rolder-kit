// Добавляет и обновляет функции item. Пока очень коряво.

import type { Item } from '@shared/types-v0.1.0';
import type { HierarchyData, HierarchyNode, ItemSelectionState, Store } from '../node/store';

export type ItemFunctions = {
	getRef: (dbClass: string) => Item | Item[] | { id: string } | { id: string }[];
	getRoot: () => Item;
	getParent: () => Item | undefined;
	getChildren: (dbClass?: string) => Item[];
	getDescendants: (params?: { dbClass?: string; skipSelf?: boolean }) => Item[];
	getAncestors: (params?: { dbClass?: string; skipSelf?: boolean }) => Item[];
	getHierarchyData: () => HierarchyData;
	getSelected: (params?: { dbClass?: string; withIndeterminate?: boolean; withParent?: boolean }) => Item[];
	getSelectionState: () => ItemSelectionState;
};

export default (s: Store, node: HierarchyNode, backendItem: Item, item?: Item) => {
	const { compare, map, get, set } = R.libs.just;
	let changeState = {
		getParent: false,
		getChildren: true,
		getDescendants: false,
		getAncestors: false,
		getHierarchyData: false,
		getSelected: false,
		getSelectionState: false,
	};

	const funcs: ItemFunctions = {
		// Cвязь.
		getRef: (dbClass) => {
			if (Array.isArray(backendItem[dbClass])) return backendItem[dbClass].map((i) => R.items.get(i.id) || (i as Item));
			else return R.items.get(backendItem[dbClass]?.id) || (backendItem[dbClass] as Item);
		},
		// Корень.
		getRoot: () => R.items.get(s.rootId) as Item,
		// Родитель.
		getParent: () => (node.parent ? R.items.get(node.parent.data.id) : undefined),
		// Дети.
		getChildren: (dbClass) =>
			node.children
				?.filter((i) => (dbClass ? i.data.dbClass === dbClass : true))
				.map((i) => R.items.get(i.data.id))
				.filter((i) => i !== undefined) || [],
		// Наследники.
		getDescendants: (p) => {
			let descendants = node.descendants().filter((i) => notFiltered(s.rootId, i, p));
			if (p?.skipSelf) descendants = descendants.filter((i) => i.data.id !== node.data.id);
			return descendants.map((i) => R.items.get(i.data.id)).filter((i) => i !== undefined);
		},
		// Предки.
		getAncestors: (p) => {
			let ancestors = node.ancestors().filter((i) => notFiltered(s.rootId, i, p));
			if (p?.skipSelf) ancestors = ancestors.filter((i) => i.data.id !== node.data.id);
			return ancestors.map((i) => R.items.get(i.data.id)).filter((i) => i !== undefined);
		},
		// Часть иерархии, принадлежащая этому item.
		getHierarchyData: () => node.data.hierarchyData,
		// Выбор.
		getSelected: (p) => {
			const states = p?.withIndeterminate ? ['selected', 'indeterminate'] : ['selected'];
			let selectedNodes = node.descendants().filter((i) => {
				let filtered = !notFiltered(s.rootId, i, p);
				if (!filtered) {
					const itemState = R.items.get(i.data.id)?.getSelectionState();
					if (itemState && states.includes(itemState.selection)) return true;
					else return false;
				} else return false;
			});
			if (!p?.withParent) selectedNodes = selectedNodes.filter((i) => i.data.id !== node.data.id);
			const uniqueIds = R.libs.just.unique(selectedNodes.map((i) => i.data.id));
			return uniqueIds.map((id) => R.items.get(id)).filter((i) => i !== undefined);
		},
		// Реактивное состояние выбора.
		getSelectionState: () => {
			const defaultState = { selection: 'notSelected' } as ItemSelectionState;
			const rootNode = node.ancestors().find((i) => i.data.id === s.rootId);
			if (rootNode) {
				const path = node
					.path(rootNode)
					.map((i) => i.data.id)
					.join();
				if (path) return R.libs.just.get(s.itemsSelectionState, path) || defaultState;
			}

			return defaultState;
		},
	};
	backendItem = { ...backendItem, ...funcs } as Item;

	// Реактинвость изменения функций. Не всем функциям это нужно. Нужно там где используется здешняя нода.
	if (item) {
		if (item.getParent()?.id !== funcs.getParent()?.id) changeState.getParent = true;
		if (
			!compare(
				item.getChildren().map((i) => i.id),
				funcs.getChildren().map((i) => i.id)
			)
		)
			changeState.getChildren = true;
		if (
			!compare(
				item.getDescendants().map((i) => i.id),
				funcs.getDescendants().map((i) => i.id)
			)
		)
			changeState.getDescendants = true;
		if (
			!compare(
				item.getAncestors().map((i) => i.id),
				funcs.getAncestors().map((i) => i.id)
			)
		)
			changeState.getAncestors = true;
		if (
			!compare(
				Object.values(item.getHierarchyData())
					.map((i) => i.itemIds)
					.flat(),
				Object.values(funcs.getHierarchyData())
					.map((i) => i.itemIds)
					.flat()
			)
		)
			changeState.getHierarchyData = true;
		if (
			!compare(
				item.getSelected().map((i) => i.id),
				funcs.getSelected().map((i) => i.id)
			)
		)
			changeState.getSelected = true;
		if (item.getSelectionState().selection !== funcs.getSelectionState().selection) changeState.getSelectionState = true;
	}

	// Сохраним функции в хранилище для последующих вызовов.
	R.itemHandlers.funcs.set(backendItem.id, funcs);
	map(
		changeState,
		(funcName, changed) =>
			(changed || !item) &&
			// Вся хитрость здесь. Нужен колбек, чтобы вытащить новую функцию. Само тело функции не меняется, но почему-то,
			// если просто хранить функции в item, он выдает старые данные при смене схемы или состава иерархии.
			set(backendItem, funcName, (...args: any) => get(R.itemHandlers.funcs.get(backendItem.id) as any, funcName)(...args))
	);

	return { changeState, backendItemWithFuncs: backendItem };
};

const notFiltered = (rootId: string, node: HierarchyNode, p?: { dbClass?: string }) => {
	if (node.data.id === rootId) return false;
	if (p?.dbClass) {
		if (node.data.dbClass === p.dbClass) return true;
		else return false;
	} else return true;
};
