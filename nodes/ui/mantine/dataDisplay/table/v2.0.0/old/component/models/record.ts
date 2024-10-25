/* Модель строки. */
import type { Props } from '../../node/definition'
import type { Store } from '../store'

export type TableRecord = { id: string }

export const setRecordIds = (p: Props, s: Store) => {
	if (p.items) {
		s.records = p.items.map((i) => ({ id: i.id }))
		s.originalIds = p.items.map((i) => i.id)
	} else s.records = []
}
