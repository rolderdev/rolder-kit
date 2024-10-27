import type { Item } from 'types'
import type { Store } from '../store'

export default function (store: Store, item: Item): string {
	const onRowClick = store.tableProps.onRowClick.get()

	switch (onRowClick) {
		case 'signal': {
			const clickFilterFunc = store.tableProps.clickFilterFunc?.get()
			if (clickFilterFunc && !clickFilterFunc(item)) return 'unset'
			return 'pointer'
		}
		case 'singleSelection': {
			const singleSelectionFilterFunc = store.tableProps.singleSelectionFilterFunc?.get()
			if (singleSelectionFilterFunc && !singleSelectionFilterFunc(item)) return 'unset'
			return 'pointer'
		}
		case 'expansion': {
			const filterFunc = store.tableProps.expansion.filterFunc?.get()
			if (filterFunc && !filterFunc(item)) return 'unset'
			return 'pointer'
		}
		default:
			return 'unset'
	}
}
