import getValue from '@packages/get-value'

export default function (item: any, target: string) {
	if (item && target) {
		const newItem: any = {}
		if (item.group) newItem.group = item.group
		if (item.disabled) newItem.disabled = item.disabled
		if (item.value) newItem.value = item.value
		else if (item.id) newItem.value = item.id
		else newItem.value = getValue(item, target)
		newItem.label = getValue(item, target)
		if (newItem.value && newItem.label) return newItem
		else return undefined
	} else return undefined
}
