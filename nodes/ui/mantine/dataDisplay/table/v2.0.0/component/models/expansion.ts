/* Модель расширяемых строк. */

import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0'
import useItem from '../shared/useItem'
import useNode from '../shared/useNode'
import type { Store } from '../store'

export type ExpansionRows = Record<string, React.ReactNode>

// Метод установки состояния развернутой строки по клику на строку или шеврон.
export const toggleRowExpansion = (s: Store, id: string) => {
	const toggle = !s.expandedIds[id]

	s.expandedIds[id] = toggle
	s.expandedIdsArr = Object.keys(s.expandedIds).filter((id) => s.expandedIds[id])

	if (s.tableProps.expansion.useHierarchy) {
		const nodeStore = useNode(s, id, 'store')
		if (nodeStore) {
			nodeStore.states.expansion.value = toggle
			if (toggle) {
				for (const n of nodeStore.childNodes()) {
					n.states.expansion.value = false
				}
			}
			const rootNode = nodeStore.rootNode()
			if (rootNode) Noodl.Events.emit(`${rootNode.path}_expansionChanged`)
		}
	}

	sendOutput(
		s.noodlNode,
		'expandedItems',
		R.libs.just.map(s.expandedIds, (id, v) => v && R.items[id])
	)
	sendSignal(s.noodlNode, 'expandedItemsChanged')
}

// Метод установки новых строк с порта.
// На уровне декларации порта проверяется, что нельзя подать массив с несколькими items, если allowMultiple = false.
export const setExpandedIds = (s: Store, expandedIds: string[], isDefault?: boolean) => {
	const { compare } = R.libs.just

	// Отфильтруем по items этой таблицы и функцией разработчика.
	const newExpandedIds = expandedIds.filter((id) => s.records.map((i) => i.id).includes(id) && !expansionFiltered(s, id))
	const expendedIds = Object.keys(s.expandedIds).filter((id) => s.expandedIds[id])

	if (!compare(expendedIds.sort(), newExpandedIds.sort())) {
		s.expandedIds = {}
		for (const id of newExpandedIds) {
			s.expandedIds[id] = true
		}
		s.expandedIdsArr = newExpandedIds

		if (s.tableProps.expansion.useHierarchy) {
			if (s.hierarchy?.tableNode) {
				for (const childNode of s.hierarchy.tableNode.childNodes()) {
					if (childNode.itemId) {
						childNode.states.expansion.value = s.expandedIds[childNode.itemId]
					}
				}

				const rootNode = s.hierarchy.tableNode.rootNode()
				if (rootNode) Noodl.Events.emit(`${rootNode.path}_expansionChanged`)
			}
		}

		sendOutput(
			s.noodlNode,
			'expandedItems',
			newExpandedIds.map((id) => R.items[id])
		)
		if (!isDefault) sendSignal(s.noodlNode, 'expandedItemsChanged')
	}
}

// Метод фильтрации.
export const expansionFiltered = (s: Store, id: string) => {
	let filter = false
	try {
		const filterFunc = s.funcs.expansionFilterFunc
		const itemSnap = useItem(id, 'snap')
		filter = itemSnap && filterFunc ? !filterFunc(itemSnap, useNode(s, id, 'snap')) : false
	} catch (e: any) {
		log.error('expansion filterFunc error', e)
		R.libs.mantine?.MantineError?.('Системная ошибка!', `expansion filterFunc error. ${e.message}`)
	}

	return filter
}
