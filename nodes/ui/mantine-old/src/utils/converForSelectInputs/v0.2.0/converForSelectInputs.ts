export default function (item: any, target: string) {
    const { getValue } = window.R.utils

    if (item && target) {
        let newItem: any = {}
        if (item.group) newItem.group = item.group
        if (item.disabled) newItem.disabled = item.disabled
        if (item.value) newItem.value = item.value
        else if (item.id) newItem.value = item.id
        else newItem.value = getValue.v7(item, target)
        newItem.label = getValue.v7(item, target)
        return newItem
    } else return undefined
}