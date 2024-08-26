import type { Item } from '@shared/types-v0.1.0';
import type { HierarchyData, HierarchyNode, ItemSelectionState, Store } from '../node/store';

export type HyerarchyNodeFunctions = {
	getRef: (dbClass: string) => Item | Item[];
	getSelectionState: () => ItemSelectionState;
	getHierarchyData: () => HierarchyData;
	getRoot: () => Item;
	getParant: () => Item | undefined;
	getChildren: (dbClass?: string) => Item[];
	getSelected: (params?: { dbClass?: string; withIndeterminate?: boolean; withParent?: boolean }) => Item[];
	getDescendants: (params?: { dbClass?: string; skipSelf?: boolean }) => Item[];
	getAncestors: (params?: { dbClass?: string; skipSelf?: boolean }) => Item[];
};

export default (node: HierarchyNode, backendItem: Item, s: Store) => {
	// Cвязь.
	backendItem.getRef = (dbClass) => {
		if (Array.isArray(backendItem[dbClass])) return backendItem[dbClass].map((i) => R.items.get(i.id) || (i as Item));
		else return R.items.get(backendItem[dbClass]?.id) || (backendItem[dbClass] as Item);
	};
	// Реактивное состояние.
	backendItem.getSelectionState = () => {
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
	};
	// Часть иерархии, принадлежащая этому item.
	backendItem.getHierarchyData = () => node.data.hierarchyData;
	// Корень.
	backendItem.getRoot = () => s.rootItem;
	// Родитель.
	backendItem.getParant = () => (node.parent ? R.items.get(node.parent.data.id) : undefined);
	// Дети.
	backendItem.getChildren = (dbClass) =>
		node.children
			?.filter((i) => (dbClass ? i.data.dbClass === dbClass : true))
			.map((i) => R.items.get(i.data.id))
			.filter((i) => i !== undefined) || [];
	// Наследники.
	backendItem.getDescendants = (p) => {
		let descendants = node.descendants().filter((i) => notFiltered(s.rootId, i, p));
		if (p?.skipSelf) descendants = descendants.filter((i) => i.data.id !== node.data.id);
		return descendants.map((i) => R.items.get(i.data.id)).filter((i) => i !== undefined);
	};
	// Предки.
	backendItem.getAncestors = (p) => {
		let ancestors = node.ancestors().filter((i) => notFiltered(s.rootId, i, p));
		if (p?.skipSelf) ancestors = ancestors.filter((i) => i.data.id !== node.data.id);
		return ancestors.map((i) => R.items.get(i.data.id)).filter((i) => i !== undefined);
	};
	// Выбор.
	backendItem.getSelected = (p) => {
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
	};

	return backendItem;
};

const notFiltered = (rootId: string, node: HierarchyNode, p?: { dbClass?: string }) => {
	if (node.data.id === rootId) return false;
	if (p?.dbClass) {
		if (node.data.dbClass === p.dbClass) return true;
		else return false;
	} else return true;
};
