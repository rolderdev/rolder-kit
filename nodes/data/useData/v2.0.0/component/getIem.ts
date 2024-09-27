import type { Item } from '@shared/types-v0.1.0';
import type { HistoryItem } from './fetch';

export default (item: Item, rootId: string) => {
	const roots: string[] = [...(item.roots || []), rootId];

	const prototype = Object.create(
		{
			getRef: (dbClass: string) => {
				const globalItem = R.items[item.id];
				if (globalItem && globalItem[dbClass]) {
					if (Array.isArray(globalItem[dbClass])) return globalItem[dbClass].map((i) => R.items[i.id]).filter((i) => !!i);
					else return R.items[globalItem[dbClass].id];
				} else return undefined;
			},
			getBackRef: (dbClass: string) => {
				let resultRefItem: Item | undefined;
				R.libs.just.map(R.items, (_, refItem) => {
					if (refItem.dbClass === dbClass && refItem[item.dbClass]) resultRefItem = refItem;
				});
				return resultRefItem;
			},
			getHistory: (count?: number) => {
				const snapshot = R.libs.valtio.snapshot;
				const take = R.libs.remeda.take;

				return R.itemsHistory[item.id]
					? count
						? (take(snapshot(R.itemsHistory[item.id]), count) as HistoryItem[])
						: (snapshot(R.itemsHistory[item.id]) as HistoryItem[])
					: [];
			},
			getDbClassState: (statePath: string) => R.libs.just.get(R.dbClasses, `${item.dbClass}.states.${statePath}`),
			roots,
		},
		{
			id: { enumerable: true, writable: false, configurable: false, value: item.id },
			dbClass: { enumerable: true, writable: false, configurable: false, value: item.dbClass },
		}
	);

	return Object.assign(prototype, R.libs.just.omit(item, ['id', 'dbClass']));
};
