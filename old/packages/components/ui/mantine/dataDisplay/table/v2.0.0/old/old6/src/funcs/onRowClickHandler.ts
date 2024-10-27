import { sendOutput, sendSignal } from '@packages/port-send'
import type { Item } from 'types'
import { setExpanedIds } from '../models/expansionModel'
import { setSelectedItem } from '../models/singleSelectionModel'
import type { Store } from '../store'

export default function (store: Store) {
	const onRowClick = store.tableProps.onRowClick.get()
	if (onRowClick === 'disabled') return undefined

	return ({ record }: { record: Item }) => {
		switch (onRowClick) {
			case 'signal': {
				const clickFilterFunc = store.tableProps.clickFilterFunc?.get()
				// Если разработчик добавил проверку и она false, отменяем отправку.
				if (clickFilterFunc && !clickFilterFunc(record)) return
				sendOutput(store.noodlNode.get(), 'clickedItem', record)
				sendSignal(store.noodlNode.get(), 'rowClicked')
				return
			}
			case 'singleSelection': {
				setSelectedItem(store, record)
				return
			}
			case 'expansion': {
				setExpanedIds(store, record)
				return
			}
			default:
				return 'unset'
		}
	}
}
