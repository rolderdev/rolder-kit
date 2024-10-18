import { getDbClassName } from '@shared/db-class'
import type { NoodlNode } from '@shared/node-v1.0.0'
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0'
import type { Item } from '@shared/types-v0.1.0'
import type { Props } from '../node/definition'
import type { SchemeData } from '../node/store'
import Node from './Node'

export default (p: Props, noodlNode: NoodlNode) => {
	// Подготовим иерархию. Она должна быть атомарной. Т.е. каждая нода содержит информацию о свзях, но свзяи не проложены.
	const flatNodes: Node[] = []
	Node.createHierarchy(p, flatNodes)
	// Создадим прокси нод иерархии или обновим их для реактивности.
	Node.setNodesProxy(p, flatNodes)

	const data: { [dbClass: string]: SchemeData & { items: Item[] } } = {}

	// В data выдаем только родительские схемы.
	for (const schemeData of p.store.schemesData) {
		const dbClassName = getDbClassName(schemeData.scheme.dbClass)

		if (schemeData.path === 'root') {
			data[dbClassName] = {
				...schemeData,
				items: schemeData.itemIds.map((id) => R.items[id]).filter((i) => !!i),
			}

			if (p.outputDbClasses?.includes(dbClassName)) {
				sendOutput(
					noodlNode,
					`${dbClassName}Items`,
					schemeData.itemIds.map((id) => R.items[id]).filter((i) => !!i)
				)
				sendOutput(noodlNode, `${dbClassName}Fetched`, schemeData.fetched)
				sendOutput(noodlNode, `${dbClassName}Total`, schemeData.total)
				sendOutput(noodlNode, `${dbClassName}Aggregations`, schemeData.aggregations)
			}
		}
	}

	sendOutput(noodlNode, 'data', data)
	sendOutput(noodlNode, 'rootId', p.store.rootId)
	sendOutput(noodlNode, 'rootNode', R.nodes[p.store.rootId])
	sendOutput(noodlNode, 'schemesData', p.store.schemesData)
	sendOutput(noodlNode, 'fetching', false)
	sendSignal(noodlNode, 'fetched')
}
