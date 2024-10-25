/* Модель состояния иерархичности таблицы. */

import type Node from '@nodes/use-data-v2.0.0/component/Node'
import type { Props } from '../../node/definition'
import type { Store } from '../store'

export type HierarchyState = {
	isChild: boolean // Ребенок или уровень устанавливаются не зависимо от того используется ли иерархия useData,
	level: number // т.к. таблицы можно выстроить в иерархию и без нее.
	tableNodePath?: string // Эти два параметра наполняются из useData.
	tableNode?: Node
}

export const setHierarchyState = (p: Props, s: Store) => {
	// metaData есть в родителе не зависимо от того используется ли иерархия useData.
	const parentMetaData = p.noodlNode.nodeScope.componentOwner.metaData
	// Для детей.
	if (parentMetaData)
		s.hierarchy = {
			isChild: true,
			level: parentMetaData.level + 1,
			tableNodePath: parentMetaData.nodePath, // Эти два параметра наполняются в родителе, а корень из useData.
			tableNode: R.nodes[parentMetaData.nodePath],
		}
	// Для корня.
	else
		s.hierarchy = {
			isChild: false,
			level: 0,
			tableNodePath: p.rootNodeId,
			tableNode: p.rootNodeId ? R.nodes[p.rootNodeId] : undefined,
		}
}
