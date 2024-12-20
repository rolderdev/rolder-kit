import type { NoodlNode } from '@packages/node'
import { sendOutput, sendSignal } from '@packages/port-send'
import { deepMap } from 'nanostores'
import { useEffect, useState } from 'react'
import type { Item } from 'types'
import type { TableProps } from '../../types'

const selectedRecordAtom = deepMap<{ [tableId: string]: Item | undefined }>()

export default function (
	noodlNode: NoodlNode,
	tableId: string,
	singleSelection: TableProps['selection']['single'],
	items: Item[]
) {
	const [selectedRecord, setSelectedRecordState] = useState<Item>()

	function setSelectedRecord(tableId: string, item?: Item) {
		selectedRecordAtom.setKey(tableId, item)
		if (item && items.map((i) => i.id).includes(item.id)) {
			setSelectedRecordState(item)
			sendOutput(noodlNode, 'table2SingleSelectedItem', item)
			sendSignal(noodlNode, 'table2SingleSelected')
		} else {
			setSelectedRecordState(undefined)
			sendOutput(noodlNode, 'table2SingleSelectedItem', null)
			sendSignal(noodlNode, 'table2SingleUnselected')
		}
	}

	useEffect(() => {
		setSelectedRecord(tableId, singleSelection.selectedItem)
	}, [singleSelection.selectedItem])

	return { selectedRecord, setSelectedRecord }
}
