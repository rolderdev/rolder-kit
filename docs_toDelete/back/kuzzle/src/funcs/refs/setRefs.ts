import type { Item } from 'src/types';

export function setRefs(items: Item[], refDbClass: string, refItems: Item[]) {
	return items.map((item: any) => {
		if (Array.isArray(item[refDbClass])) {
			const refItemsArr = refItems.filter((i) => item[refDbClass]?.map((i) => i.id).includes(i.id));
			if (refItemsArr?.length) item[refDbClass] = refItemsArr;
		} else {
			const refItem = refItems.find((i) => item[refDbClass]?.id === i.id);
			if (refItem) item[refDbClass] = refItem;
		}

		return item;
	});
}

export function setBackRefs(dbClass: string, items: Item[], refDbClass: string, refItems: Item[]) {
	return items.map((item) => {
		const refItemsArr = refItems.filter((i) => item.id === i[dbClass]?.id);
		if (refItemsArr?.length) item[refDbClass] = refItemsArr;

		return item;
	});
}
