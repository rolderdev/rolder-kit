import type { Item } from '@shared/types-v0.1.0';
import type { Props } from '../node/definition';

export type Nodes = Record<string, Node>;
export type NodeSelectionState = { value: SelectionState };
export type SelectionState = 'notSelected' | 'selected' | 'indeterminate';
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
	selectionState: NodeSelectionState;
	aggregations: Aggregations;

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
		const { ref, proxy } = R.libs.valtio;

		this.rootId = rootId;
		this.dbClass = dbClass;
		this.path = path;
		this.level = level;
		this.childIds = childIds;
		this.childPathes = childPathes;
		this.itemId = itemId;
		this.parentId = parentId;
		this.parentPath = parentPath;
		// Нужен ref при первичном создании, чтобы изменение выбора не тригерило всю ноду.
		this.selectionState = ref(proxy({ value: 'notSelected' }));
		this.aggregations = aggregations;
	}

	//// Внутренние методы.
	static createHierarchy(p: Props, flatNodes: Node[]) {
		const rootId = p.store.rootId;

		const rootChildIds = Array.from(p.store.schemes.values())
			.filter((i) => !i.parentId)
			.flatMap((i) => i.itemIds);
		const aggregations: Aggregations = {};
		p.store.schemes.forEach((i) => {
			if (!i.parentId && i.aggregations) aggregations[i.scheme.dbClass] = i.aggregations;
		});

		const rootNode = new Node(
			rootId,
			'rootNode',
			rootId,
			-1,
			rootChildIds,
			rootChildIds.map((id) => `${id}.${rootId}`),
			aggregations
		);
		flatNodes.push(rootNode);

		Node.createNodes(p, rootId, rootId, rootChildIds, 0, flatNodes);
	}

	static createNodes(p: Props, parentId: string, parentPath: string, childIds: string[], level: number, flatNodes: Node[]) {
		const rootId = p.store.rootId;

		childIds.map((id) => {
			const dbClass = Array.from(p.store.schemes.values()).find((i) => i.itemIds.includes(id))?.scheme.dbClass || 'rootNode';
			const aggregations: Aggregations = {};
			p.store.schemes.forEach((i) => {
				if (i.parentId === id && i.aggregations) aggregations[i.scheme.dbClass] = i.aggregations;
			});
			const thisNodeChildIds = Array.from(p.store.schemes.values())
				.filter((i) => i.parentId === id)
				.flatMap((i) => i.itemIds);

			flatNodes.push(
				new Node(
					rootId,
					dbClass,
					`${id}.${parentPath}`,
					level,
					thisNodeChildIds,
					thisNodeChildIds.map((childId) => `${childId}.${id}.${parentPath}`),
					aggregations,
					id,
					parentId,
					parentPath
				)
			);

			this.createNodes(p, id, `${id}.${parentPath}`, thisNodeChildIds, level + 1, flatNodes);
		});
	}

	static setNodesProxy(p: Props, flatNodes: Node[]) {
		const { map, set } = R.libs.just;
		// Важно не заменять весь прокси.
		for (const node of flatNodes) {
			const nodeProxy = R.nodes[node.path];
			if (nodeProxy) map(node as any, (k, v) => k !== 'selectionState' && set(nodeProxy, k, v));
			else R.nodes[node.path] = node;
		}

		// Нужно чуть отложить удаление. У таблиц сворачивает голову.
		setTimeout(
			() =>
				Object.values(R.nodes)
					.filter((node) => !flatNodes.map((i) => i.path).includes(node.path))
					.forEach((i) => delete R.nodes[i.path]),
			500
		);
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

	selected(dbClass?: string, withIndeterminate?: boolean) {
		const states = withIndeterminate ? ['selected', 'indeterminate'] : ['selected'];
		const allSelectedNodes = this.descendantNodes().filter((i) => states.includes(i.selectionState.value));
		const selectedItems = filterDbClass(
			allSelectedNodes.map((i) => i.item()),
			dbClass
		);

		return R.libs.remeda.uniqueWith(selectedItems, (a, b) => a.id === b.id);
	}
}

const filterDbClass = (items: (Item | undefined)[], dbClass?: string) =>
	items.filter((i) => (dbClass ? i?.dbClass === dbClass : true)).filter((i) => !!i);
