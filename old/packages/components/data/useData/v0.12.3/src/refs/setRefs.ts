import type { Item } from 'types'

export function setRefs(sourceItems: Item[], refDbClass: string, refItems: Item[]) {
	const items = sourceItems.map((sourceItem: any) => {
		if (Array.isArray(sourceItem[refDbClass])) {
			const refItemsArr = refItems?.filter((i: any) => sourceItem[refDbClass]?.map((i: any) => i.id).includes(i.id))
			if (refItemsArr?.length) sourceItem[refDbClass] = refItemsArr.map((i) => new Proxy(i, {}))
		} else {
			const refItem = refItems?.find((i: any) => sourceItem[refDbClass]?.id === i.id)
			if (refItem) sourceItem[refDbClass] = new Proxy(refItem, {})
		}
		return sourceItem
	})
	return items
}

export function setBackRefs(dbClass: string, sourceItems: Item[], refDbClass: string, refItems: Item[]) {
	const items = sourceItems.map((sourceItem: any) => {
		const refItemsArr = refItems?.filter((i: any) => sourceItem.id === i[dbClass]?.id)
		if (refItemsArr?.length) sourceItem[refDbClass] = refItemsArr.map((i) => new Proxy(i, {}))
		return sourceItem
	})
	return items
}
