/* Модель единичного выбора. */

import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0'
import { useEffect } from 'react'
import useItem from '../funcs/useItem'
import useNode from '../funcs/useNode'
import type { Store } from '../store'

// Метод установки выбора. Фильтрует по items.
// Устанавливает новый выбор, если новый не совпадает со старым.
// Сбрасывает выбор, если новый совпадает со старым.
export const setSelectedId = (s: Store, selectedId: string, isDefault?: boolean) => {
	const selectedItemSnap = useItem(selectedId, 'snap')
	const nodeSnap = useNode(s, selectedId, 'snap')

	if (selectedItemSnap) {
		if (s.selectedId !== selectedId) {
			const filterFunc = s.tableProps.singleSelectionFilterFunc
			if (filterFunc && !filterFunc(selectedItemSnap, nodeSnap)) return
			s.selectedId = selectedId
		} else s.selectedId = null

		setHierarhySingleSelection(s)

		sendOutput(s.noodlNode, 'selectedItem', s.selectedId ? R.items[s.selectedId] : null)
		sendOutput(s.noodlNode, 'selectedNode', nodeSnap || null)
		if (!isDefault) sendSignal(s.noodlNode, 'selectedItemChanged')
	}
}

// Метод сброса выбора. Проверяет есть ли что сбрасывать.
export const resetSelectedId = (s: Store) => {
	if (s.selectedId) {
		s.selectedId = null
		setHierarhySingleSelection(s)
		sendOutput(s.noodlNode, 'selectedItem', null)
		sendOutput(s.noodlNode, 'selectedNode', null)
		sendSignal(s.noodlNode, 'selectedItemChanged')
	}
}

// Метод установки состояния иерархии.
const setHierarhySingleSelection = (s: Store) => {
	if (s.tableProps.useSingleSelectionHierarchy) {
		if (s.hierarchy.tableNode) {
			const rootNode = s.hierarchy.tableNode.rootNode()
			if (rootNode) {
				for (const node of rootNode.descendantNodes(true)) {
					if (node.path === s.hierarchy.tableNode?.path) node.states.singleSelection.value = s.selectedId
					else node.states.singleSelection.value = null
				}
				Noodl.Events.emit(`${rootNode.path}_singleSelectionChanged`)
			}
		}
	}
}

// Хук подписки на изменение выбора в иерархии.
export const useHierarhySingleSelection = (s: Store) => {
	useEffect(() => {
		let unsub: (() => void) | undefined
		if (s.hierarchy.tableNode) {
			unsub = R.libs.valtio.subscribe(s.hierarchy.tableNode.states.singleSelection, () => {
				// Не будем тригерить повторно выходы, если это событие произошло по нажатию в этой таблице.
				const newSelectedId = s.hierarchy.tableNode?.states.singleSelection.value || null
				if (s.selectedId !== newSelectedId) {
					s.selectedId = newSelectedId

					sendOutput(s.noodlNode, 'selectedItem', newSelectedId ? R.items[newSelectedId] : null)
					sendOutput(s.noodlNode, 'selectedNode', newSelectedId ? useNode(s, newSelectedId, 'snap') : null)
					sendSignal(s.noodlNode, 'selectedItemChanged')
				}
			})
		}
		return () => unsub?.()
	}, [s, s.hierarchy.tableNode, s.hierarchy.tableNode?.states.singleSelection, s.noodlNode, s.selectedId])
}
