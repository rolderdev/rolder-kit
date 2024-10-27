import type { NoodlNode } from '@packages/node'
import { sendOutput, sendSignal } from '@packages/port-send'
import { useEffect, useState } from 'react'
import type { Item } from 'types'
import type { TableState } from '../../types'

export default function (noodlNode: NoodlNode, singlSelection: TableState['selection']['single'], items: Item[]) {
	const [selectedRecord, setSelectedRecordState] = useState<Item | undefined>(singlSelection.selectedItem)

	function setSelectedRecord(record: Item) {
		if (singlSelection.unselectable && record.id === selectedRecord?.id) {
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

	/* useEffect(() => {
		// Нужна проверка на то, не собрался ли воткнуть разработчик сюда items, не принадлежащие к этой таблице
		// Берем item с порта только, если он существует в таблице
		if (singlSelection.selectedItem && items.map((i) => i.id).includes(singlSelection.selectedItem.id)) {
			setSelectedRecordState(singlSelection.selectedItem);
		}
	}, [singlSelection.selectedItem]); */

	return { selectedRecord, setSelectedRecord, resetSelectedRecord }
}
