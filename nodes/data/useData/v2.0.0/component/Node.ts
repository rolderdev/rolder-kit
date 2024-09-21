import type { Item } from '@shared/types-v0.1.0';
import type { Props } from '../node/definition';
import type { SchemeData } from '../node/store';

export type Nodes = Record<string, Node>;
export type NodeSingleSelection = { value: string | null }; // Выбранный ребенок.
export type NodeMultiSelection = { value: MultiSelection };
export type MultiSelection = 'notSelected' | 'selected' | 'indeterminate';
export type NodeExpansion = { value: boolean };
type Aggregations = Record<string, Record<string, any>>;

export default class Node {
	rootId: string;
	itemId?: string;
	dbClass: string;
	path: string;
	level: number;
	parentId?: string;
	parentPath?: string;
	childIds: string[];
	childPathes: string[];
	aggregations: Aggregations;
	states: {
		singleSelection: NodeSingleSelection; // Выбранный ребенок.
		multiSelection: NodeMultiSelection;
		expansion: NodeExpansion;
	};

	constructor(
		rootId: string,
		dbClass: string,
		path: string,
		level: number,
		childIds: string[],
		childPathes: string[],
		aggregations: Aggregations,
		itemId?: string,
		parentId?: string,
		parentPath?: string
	) {
		this.rootId = rootId;
		this.dbClass = dbClass;
		this.path = path;
		this.level = level;
		this.childIds = childIds;
		this.childPathes = childPathes;
		this.itemId = itemId;
		this.parentId = parentId;
		this.parentPath = parentPath;
		this.states = { singleSelection: { value: null }, multiSelection: { value: 'notSelected' }, expansion: { value: false } };
		this.aggregations = aggregations;
	}

	//// Внутренние методы.
	static createHierarchy(p: Props, flatNodes: Node[]) {
		const rootId = p.store.rootId;

		const rootChildIds = Array.from(p.store.schemes.values())
			.filter((i) => !i.parentSchemeHash)
			.flatMap((i) => i.itemIds);

		const aggregations: Aggregations = {};
		p.store.schemes.forEach((i) => {
			const dbClass = typeof i.scheme.dbClass === 'string' ? i.scheme.dbClass : i.scheme.dbClass.name;
			if (!i.parentSchemeHash && i.aggregations) aggregations[dbClass] = i.aggregations;
		});

		flatNodes.push(
			new Node(
				rootId,
				'rootNode',
				rootId,
				-1,
				rootChildIds,
				rootChildIds.map((id) => `${id}.${rootId}`),
				aggregations
			)
		);

		const rootSchemesData = Array.from(p.store.schemes.values()).filter((i) => !i.parentSchemeHash);
		this.createChildren(p, rootSchemesData, rootId, 0, flatNodes);
	}

	static createChildren(p: Props, schemesData: SchemeData[], parentPath: string, level: number, flatNodes: Node[]) {
		schemesData.forEach((schemeData) => {
			const dbClass = typeof schemeData.scheme.dbClass === 'string' ? schemeData.scheme.dbClass : schemeData.scheme.dbClass.name;

			schemeData.itemIds.forEach((itemId) => {
				const thisNodeChildIds = Array.from(p.store.schemes.values())
					.filter((i) => i.parentId === itemId && i.parentSchemeHash === schemeData.schemeHash)
					.flatMap((i) => i.itemIds);

				const aggregations: Aggregations = {};
				p.store.schemes.forEach((i) => {
					const dbClass = typeof i.scheme.dbClass === 'string' ? i.scheme.dbClass : i.scheme.dbClass.name;
					if (i.parentSchemeHash === schemeData.schemeHash && i.aggregations) aggregations[dbClass] = i.aggregations;
				});

				flatNodes.push(
					new Node(
						p.store.rootId,
						dbClass,
						`${itemId}.${parentPath}`,
						level,
						thisNodeChildIds,
						thisNodeChildIds.map((childId) => `${childId}.${itemId}.${parentPath}`),
						aggregations,
						itemId,
						schemeData.parentId,
						parentPath
					)
				);

				const childSchemesData = Array.from(p.store.schemes.values()).filter(
					(i) => i.parentId === itemId && i.parentSchemeHash === schemeData.schemeHash
				);
				this.createChildren(p, childSchemesData, `${itemId}.${parentPath}`, level + 1, flatNodes);
			});
		});
	}

	static setNodesProxy(p: Props, flatNodes: Node[]) {
		const { map, set } = R.libs.just;
		// Важно не заменять весь прокси.
		for (const node of flatNodes) {
			const nodeProxy = R.nodes[node.path];
			if (nodeProxy) map(node as any, (k, v) => k !== 'states' && set(nodeProxy, k, v));
			else R.nodes[node.path] = node;
		}

		Object.values(R.nodes)
			.filter((node) => node.rootId === p.store.rootId && !flatNodes.map((i) => i.path).includes(node.path))
			.forEach((i) => delete R.nodes[i.path]);
	}

	//// Методы для разработчика.
	// Методы нод.
	rootNode() {
		return R.nodes[this.rootId];
	}

	parentNode() {
		return this.parentPath ? R.nodes[this.parentPath] : undefined;
	}

	childNodes() {
		return this.childPathes.map((path) => R.nodes[path]).filter((i) => !!i);
	}

	descendantNodes(withSelf?: boolean) {
		let descendants: Node[] = withSelf ? [this] : [];
		let children = this.childNodes();

		while (children.length) {
			descendants = descendants.concat(children);
			children = children.flatMap((i) => i.childNodes());
		}
		return descendants;
	}

	ancestorNodes(withSelf?: boolean) {
		let ancestors: Node[] = withSelf ? [this] : [];
		let parent = this.parentNode();
		while (parent) {
			ancestors.push(parent);
			parent = parent.parentNode();
		}
		return ancestors;
	}

	findNode(itemId?: string) {
		return itemId
			? this.rootNode()
					.descendantNodes()
					.find((i) => i.itemId === itemId)
			: undefined;
	}

	// Методы item.
	item() {
		return this.itemId ? R.items[this.itemId] : undefined;
	}

	parent() {
		return this.parentNode()?.item();
	}

	children(dbClass?: string) {
		return filterDbClass(
			this.childNodes().map((i) => i.item()),
			dbClass
		);
	}

	descendants(dbClass?: string, withSelf?: boolean) {
		return filterDbClass(
			this.descendantNodes(withSelf).map((i) => i.item()),
			dbClass
		);
	}

	ancestors(dbClass?: string, withSelf?: boolean) {
		return filterDbClass(
			this.ancestorNodes(withSelf).map((i) => i.item()),
			dbClass
		);
	}

	singleSelected() {
		const selectedId = this.descendantNodes().find((i) => i.states.singleSelection.value)?.states.singleSelection.value;
		return selectedId ? R.items[selectedId] : undefined;
	}

	multiSelected(dbClass?: string, withIndeterminate?: boolean) {
		const states = withIndeterminate ? ['selected', 'indeterminate'] : ['selected'];
		const allSelectedNodes = this.descendantNodes().filter((i) => states.includes(i.states.multiSelection.value));
		const selectedItems = filterDbClass(
			allSelectedNodes.map((i) => i.item()),
			dbClass
		);

		return R.libs.remeda.uniqueWith(selectedItems, (a, b) => a.id === b.id);
	}

	expanded() {
		return this.descendantNodes()
			.filter((i) => i.states.expansion.value)
			.map((i) => i.item());
	}
}

const filterDbClass = (items: (Item | undefined)[], dbClass?: string) =>
	items.filter((i) => (dbClass ? i?.dbClass === dbClass : true)).filter((i) => !!i);
