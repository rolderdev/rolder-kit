import { getValue8 } from "@rk/utils"

export default function (item: any, target: string) {
    if (item && target) {
        let newItem: any = {}
        if (item.group) newItem.group = item.group
        if (item.disabled) newItem.disabled = item.disabled
        if (item.value) newItem.value = item.value
        else if (item.id) newItem.value = item.id
        else newItem.value = getValue8(item, target)
        newItem.label = getValue8(item, target)
        return newItem
    } else return undefined
}