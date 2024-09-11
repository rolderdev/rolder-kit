import type { HistoryItem } from './fetch';

export default (itemId: string) => ({
	getRef: (dbClass: string) => {
		const globalItem = R.items[itemId];
		if (globalItem && globalItem[dbClass]) {
			if (Array.isArray(globalItem[dbClass])) return globalItem[dbClass].map((i) => R.items[i.id]).filter((i) => !!i);
			else return R.items[globalItem[dbClass].id];
		} else return undefined;
	},
	getHistory: (count?: number) => {
		const snapshot = R.libs.valtio.snapshot;
		const take = R.libs.remeda.take;

		return R.itemsHistory[itemId]
			? count
				? (take(snapshot(R.itemsHistory[itemId]), count) as HistoryItem[])
				: (snapshot(R.itemsHistory[itemId]) as HistoryItem[])
			: [];
	},
});
