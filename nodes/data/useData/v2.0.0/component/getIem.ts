import type { Item } from '@shared/types-v0.1.0'
import type { HistoryItem } from './fetch'

type RefItem = Item & { [dbClass: string]: { id: string } }

export default (rawItem: Item, rootId: string) => {
	const prototype = Object.create(
		{
			getRef: (dbClass: string) => {
				const globalItem = R.items[rawItem.id]
				if (globalItem?.[dbClass]) {
					if (Array.isArray(globalItem[dbClass])) return globalItem[dbClass].map((i) => R.items[i.id]).filter((i) => !!i)
					return R.items[globalItem[dbClass].id]
				}
				return undefined
			},
			getBackRef: (dbClass: string) => {
				let resultRefItem: Item | undefined
				R.libs.just.map(R.items as any, (_, refItem: RefItem) => {
					if (refItem.dbClass === dbClass && refItem[rawItem.dbClass]?.id === rawItem.id) resultRefItem = refItem
				})
				return resultRefItem
			},
			getHistory: (count?: number) => {
				const snapshot = R.libs.valtio.snapshot
				const take = R.libs.remeda.take

				return R.itemsHistory[rawItem.id]
					? count
						? (take(snapshot(R.itemsHistory[rawItem.id]), count) as HistoryItem[])
						: (snapshot(R.itemsHistory[rawItem.id]) as HistoryItem[])
					: []
			},
			getDbClassState: (statePath: string) => R.libs.just.get(R.dbClasses, `${rawItem.dbClass}.states.${statePath}`),
		},
		{
			id: { enumerable: true, writable: false, configurable: false, value: rawItem.id },
			dbClass: { enumerable: true, writable: false, configurable: false, value: rawItem.dbClass },
		}
	)

	return Object.assign(prototype, R.libs.just.omit(rawItem, ['id', 'dbClass']))
}
