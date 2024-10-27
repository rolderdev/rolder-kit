/* Модель мульти-выбора. */

import type { MultiSelection } from '@nodes/use-data-v2.0.0'
import type Node from '@nodes/use-data-v2.0.0/component/Node'
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0'
import { useEffect } from 'react'
import type { Props } from '../../node/definition'
import useItem from '../shared/useItem'
import useNode from '../shared/useNode'
import type { Store } from '../store'
import type { TableRecord } from './record'

export const setSelectedIds = (s: Store, newSelectedRecords: TableRecord[]) => {
	const newSelectedIds = newSelectedRecords.map((i) => i.id)
	const selectedIds = Object.keys(s.selectedIds).filter((id) => s.selectedIds[id])
	if (!R.libs.just.compare(selectedIds.sort(), newSelectedIds.sort())) {
		for (const id of newSelectedIds) s.selectedIds[id] = true
		for (const id of selectedIds) s.selectedIds[id] = newSelectedIds.includes(id)

		if (s.tableProps.multiSelection.useHierarchy) setHierarchySelection(s, newSelectedIds)

		sendOutput(
			s.noodlNode,
			'selectedItems',
			newSelectedIds.map((id) => R.items[id])
		)

		if (!s.usedDefsults.multiSelection) {
			sendSignal(s.noodlNode, 'selectedItemsChanged')
			s.usedDefsults.multiSelection = true
		}
	}
}

const setHierarchySelection = (s: Store, selectedIds: string[]) => {
	const currentTableNodes = s.records.map((i) => useNode(s, i.id, 'store')).filter((i) => i !== undefined) as Node[]

	const rootNode = currentTableNodes[0]?.rootNode()
	// Запомним текущее состояние выбора всей иерархии для будущего сравнения.
	const currentHiararchySelectedIds = rootNode
		?.multiSelected()
		.map((i) => i.id)
		.sort()

	// Проставим состояние выбора текущей таблице.
	for (const node of currentTableNodes) {
		if (node.itemId) {
			const selectionState = node.states.multiSelection
			let selection: MultiSelection = selectionState.value === 'indeterminate' ? 'indeterminate' : 'notSelected'
			if (selectedIds.includes(node.itemId)) selection = 'selected'
			selectionState.value = selection
		}
	}

	// Пройдем по всем наследникам, исключая текущую таблицу, чтобы использовать indeterminate родителя.
	for (const node of currentTableNodes) {
		// Возьмем всех наследников, исключив текущую таблицу.
		let descendantNodes = node.descendantNodes()
		// Если разработчик указал классы, то используем только их.
		if (s.tableProps.multiSelection.classes)
			descendantNodes = descendantNodes.filter((i) => s.tableProps.multiSelection.classes?.includes(i.dbClass))
		for (const descendantNode of descendantNodes) {
			const parentNode = descendantNode.parentNode()
			if (parentNode) {
				const parentState = parentNode.states.multiSelection
				// Нужно не трогать полупокеров.
				if (parentState?.value !== 'indeterminate') {
					const descendantItemState = descendantNode.states.multiSelection
					if (parentState && descendantItemState) descendantItemState.value = parentState.value
				}
			}
		}
	}

	// Возьмем всех предков ноды таблицы, включая ее саму.
	const tableNode = s.hierarchy?.tableNode
	if (tableNode) {
		for (const ancestorNode of tableNode.ancestorNodes(true)) {
			const ancestorState = ancestorNode.states.multiSelection
			if (ancestorState) {
				let childNodes = ancestorNode.childNodes()
				// Если разработчик указал классы, то используем только их.
				if (s.tableProps.multiSelection.classes)
					childNodes = childNodes.filter((i) => s.tableProps.multiSelection.classes?.includes(i.dbClass))
				const childrenCount = childNodes.length
				const selectedChildrenCount = childNodes.filter((i) => i.states.multiSelection.value === 'selected').length
				const indeterminateChildrenCount = childNodes.filter((i) => i.states.multiSelection.value === 'indeterminate').length
				// Если в детях есть полупокер, то протягиваем его вверх, иначе определяем состояние по разнице.
				ancestorState.value = indeterminateChildrenCount
					? 'indeterminate'
					: childrenCount === selectedChildrenCount
						? 'selected'
						: selectedChildrenCount === 0
							? 'notSelected'
							: 'indeterminate'
			}
		}
	}

	// Сообщим useData, что выбор изменился.
	const newHiararchySelectedIds = rootNode
		?.multiSelected()
		.map((i) => i.id)
		.sort()
	if (!R.libs.just.compare(currentHiararchySelectedIds, newHiararchySelectedIds))
		Noodl.Events.emit(`${rootNode.path}_multiSelectionChanged`)
}

// Подменим параметры чекбокса и сделаем выбор в иерархии реактивным.
export const useHierarchySelection = (s: Store) => {
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const { get, set } = R.libs.just
		const { subscribeKey } = R.libs.valtio
		// Реактивность состояния чекбокса в заголовке.
		if (!s.hierarchy?.isChild && !get(s.rows, ['header', 'hierarchyUnsub'])) {
			const tableNode = s.hierarchy?.tableNode
			if (tableNode) {
				const unsub = subscribeKey(tableNode.states.multiSelection, 'value', (selection) => {
					let newCheckBoxProps = s.libProps.allRecordsSelectionCheckboxProps || {}
					newCheckBoxProps = { ...newCheckBoxProps, indeterminate: selection === 'indeterminate' }
					// Используем параметры библиотеки.
					s.libProps.allRecordsSelectionCheckboxProps = newCheckBoxProps
				})

				set(s.rows, ['header', 'hierarchyUnsub'], unsub)
			}
		}

		// Реактивность состояния чекбоксов строк.
		s.records.forEach((record, idx) => {
			const node = useNode(s, record.id, 'store')
			if (node && !get(s.rows, ['header', record.id])) {
				setHierarchyRowSelection(s, record.id, idx)
				const unsub = subscribeKey(node.states.multiSelection, 'value', () => setHierarchyRowSelection(s, record.id, idx))

				set(s.rows, [record.id, 'hierarchyUnsub'], unsub)
			}
		})

		return () => {
			for (const unsub of Object.values(s.rows).map((i) => i.hierarchyUnsub)) unsub?.()
		}
	}, [s.records])
}

const setHierarchyRowSelection = (s: Store, id: string, idx: number) => {
	try {
		const nodeSnap = useNode(s, id, 'snap')
		const itemSnap = useItem(id, 'snap')
		const selection = nodeSnap?.states.multiSelection.value

		if (nodeSnap && itemSnap) {
			// Реактивность на измение выбора в иерархии.
			try {
				const filterFunc = s.funcs.multiSelectionFilterFunc
				const selectedIds = s.selectedIds

				// Состояние выбора.
				if (!selectedIds[itemSnap.id] && selection === 'selected') {
					if (filterFunc) {
						if (filterFunc(itemSnap, nodeSnap)) s.selectedIds[itemSnap.id] = true
					} else s.selectedIds[itemSnap.id] = true
				}
				if (selectedIds[itemSnap.id] && selection !== 'selected') {
					if (filterFunc) {
						if (filterFunc(itemSnap, nodeSnap)) s.selectedIds[itemSnap.id] = false
					} else s.selectedIds[itemSnap.id] = false
				}

				// Состояние indeterminate.
				const checkBoxProps = R.libs.just.get(s.rows, [itemSnap.id, 'checkBoxProps'])
				checkBoxProps.indeterminate = selection === 'indeterminate'
				R.libs.just.set(s.rows, [itemSnap.id, 'checkBoxProps'], checkBoxProps)
			} catch (e: any) {
				log.error('multiSelection filterFunc error', e)
				R.libs.mantine?.MantineError?.('Системная ошибка!', `multiSelection filterFunc error. ${e.message}`)
			}
		}
	} catch (e: any) {
		log.error('getRecordSelectionCheckboxProps error', e)
		R.libs.mantine?.MantineError?.('Системная ошибка!', `getRecordSelectionCheckboxProps error. ${e.message}`)
	}
}

export const isRecordSelectable = (s: Store, recordId: string, multiSelectionFilterFuncSnap: any) => {
	if (multiSelectionFilterFuncSnap) {
		const isSelectable = multiSelectionFilterFuncSnap(useItem(recordId, 'snap'), useNode(s, recordId, 'snap'))
		if (!isSelectable && s.selectedIds[recordId]) {
			const selectedRecords = Object.keys(s.selectedIds)
				.filter((id) => s.selectedIds[id] && id !== recordId)
				.map((id) => ({ id }))
			setSelectedIds(s, selectedRecords)
		}

		return isSelectable
	}

	return true
}

// Устанавливает настройки чекбокса с getRecordSelectionCheckboxProps, позволяя потом менять их для мультивыбора и отступа.
export const setCheckboxProps = (p: Props, s: Store, idsChanged: boolean) => {
	if (
		!R.libs.just.compare(p.customProps?.getRecordSelectionCheckboxProps, s.funcs.getRecordSelectionCheckboxProps) ||
		idsChanged
	) {
		for (const [idx, id] of s.originalIds.entries()) {
			const itemSnap = useItem(id, 'snap')
			if (itemSnap) {
				try {
					const checkBoxProps = p.customProps?.getRecordSelectionCheckboxProps?.(itemSnap, idx) || {}
					R.libs.just.set(s.rows, [id, 'checkBoxProps'], checkBoxProps)
				} catch (e: any) {
					log.error('getRecordSelectionCheckboxProps error', e)
					R.libs.mantine?.MantineError?.('Системная ошибка!', `getRecordSelectionCheckboxProps error. ${e.message}`)
				}
			}
		}

		s.funcs.getRecordSelectionCheckboxProps = p.customProps?.getRecordSelectionCheckboxProps
		return true
	}

	return false
}
