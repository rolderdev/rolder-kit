import type Node from '@nodes/use-data-v2.0.0/component/Node';
import type { Store } from '../store';

export default (s: Store, id: string, type: 'snap' | 'sub' | 'store') => {
	const { useSnapshot, snapshot } = R.libs.valtio;

	const nodePath = s.hierarchy.tableNode?.childNodes().find((i) => i.itemId === id)?.path;
	const node = nodePath ? R.nodes[nodePath] : undefined;

	switch (type) {
		case 'snap':
			return node ? (snapshot(node) as Node) : undefined;
		case 'sub':
			return node ? (useSnapshot(node) as Node) : undefined;
		case 'store':
			return node;
	}
};
