/* Функции для управления единичным выбором. Состояние выбора хранится в tableState */

import type { NoodlNode } from '@packages/node'
import { sendOutput, sendSignal } from '@packages/port-send'
import { useEffect, useState } from 'react'
import type { Item } from 'types'
import type { TableState } from '../../types'

// Устанавливает
export function setSelectedRecord(
	noodlNode: NoodlNode,
	singleSelection: TableState['selection']['single'],
	setTableState: (statePartial: Partial<TableState> | ((currentState: TableState) => Partial<TableState>)) => void,
	record: Item
) {
	const { unselectable, selectedItem } = singleSelection

	if (unselectable && record.id === selectedItem?.id) {
		setTableState((s) => {
			s.selection.single.selectedItem = undefined
			return s
		})
		// Noodl не переваривает undefined
		sendOutput(noodlNode, 'selectedItem', null)
		// Сиганл уйдет с задержкой в 1 мс
		sendSignal(noodlNode, 'singleUnselected')
	} else {
		setTableState((s) => {
			s.selection.single.selectedItem = record
			return s
		})
		sendOutput(noodlNode, 'selectedItem', record)
		sendSignal(noodlNode, 'singleSelected')
	}
}

export default function (
	tableState: TableState,
	setTableState: (statePartial: Partial<TableState> | ((currentState: TableState) => Partial<TableState>)) => void
) {
	// Состояние выбора.
	const [selectedRecord, setSelectedRecordState] = useState<Item | undefined>()

	const { noodlNode, records = [] } = tableState
	const { unselectable, selectedItem } = tableState.selection.single

	function setSelectedRecord(record: Item) {
		if (unselectable && record.id === selectedRecord?.id) {
			setSelectedRecordState(undefined)
			// Noodl не переваривает undefined
			sendOutput(noodlNode, 'selectedItem', null)
			// Сиганл уйдет с задержкой в 1 мс
			sendSignal(noodlNode, 'singleUnselected')
		} else {
			setSelectedRecordState(record)
			sendOutput(noodlNode, 'selectedItem', record)
			sendSignal(noodlNode, 'singleSelected')
		}
	}

	function resetSelectedRecord() {
		// Проверим, чтобы не тригерить лишнего рендеринга
		if (selectedRecord) {
			setSelectedRecordState(undefined)
			sendOutput(noodlNode, 'selectedItem', null)
			sendSignal(noodlNode, 'singleUnselected')
		}
	}

	useEffect(() => {
		// Нужна проверка на то, не собрался ли воткнуть разработчик сюда items, не принадлежащие к этой таблице
		// Берем item с порта только, если он существует в таблице
		if (selectedItem && records.map((i) => i.id).includes(selectedItem.id)) {
			setSelectedRecordState(selectedItem)
		}
	}, [selectedItem])

	return { setSelectedRecord, resetSelectedRecord }
}
