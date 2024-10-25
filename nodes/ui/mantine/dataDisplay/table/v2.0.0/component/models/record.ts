/* Модель строки. */
import type { Props } from '../../node/definition'
import type { Store } from '../store'

export type TableRecord = { id: string }

// Очень дешевая функция, поэтому обойдемся без сравнения самих items.
export const setRecordIds = (p: Props, s: Store) => {
	if (p.items) s.records = p.items.map((i) => ({ id: i.id }))
	else s.records = []
}

export const setOriginalIds = (p: Props, s: Store) => {
	if (p.items) s.originalIds = p.items.map((i) => i.id)
	else s.originalIds = []
}

export const itemIdsChanged = (p: Props, s: Store) => {
	const sortedOriginalIds = s.originalIds.sort()
	const sortedItemIds = p.items ? p.items.map((i) => i.id).sort() : []
	return !R.libs.just.compare(sortedOriginalIds, sortedItemIds)
}

export const itemsOrderChanged = (p: Props, s: Store) => {
	const itemIds = p.items ? p.items.map((i) => i.id).sort() : []
	return !R.libs.just.compare(s.originalIds, itemIds)
}
