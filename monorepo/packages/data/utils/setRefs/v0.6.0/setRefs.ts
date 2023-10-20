import mutator from "../../../libs/mutator/v0.1.0/mutator"
import setItemSysProps from "../../getRItem/v0.1.0/getRItem"

export function setItemRefs(rItem: any) {
    const { get, map } = window.R.libs.just
    // forward refs
    rItem.refs?.forEach((refDbClass: string) => {
        if (Array.isArray(rItem[refDbClass])) {
            rItem[refDbClass] = rItem[refDbClass].map((refItemId: { id: string }) => {
                const refItem = get(window.R.items, [refItemId.id])
                if (refItem) return get(window.R.items, [refItemId.id])
                else return refItemId
            })
        } else {
            const refItem = get(window.R.items, [rItem[refDbClass]?.id])
            if (refItem) rItem[refDbClass] = refItem
        }
    })
    // backward refs    
    rItem.backRefs?.forEach((refDbClass: string) => {
        const refItems: RItem[] = []
        map(window.R.items, (_itemId, refItem) => {
            if (refItem.dbClass === refDbClass && rItem.id === get(refItem, [rItem.dbClass, 'id'])) refItems.push(refItem)
        })
        if (refItems.length) rItem[refDbClass] = refItems
    })
    return rItem
}

export function setRefsFromItem(targetItem: RItem) {
    const { get, set, map } = window.R.libs.just

    map(window.R.items, (sourceItemId, sourceItem: any) => {
        // forward refs
        if (sourceItem.refs.includes(targetItem.dbClass)) {
            const targetIdItems = get(sourceItem, [targetItem.dbClass])
            if (Array.isArray(targetIdItems)) targetIdItems.forEach(targetIdItem => {
                if (targetItem.id === targetIdItem.id) {
                    targetIdItem = targetItem
                    mutator.update(setItemSysProps(sourceItem))
                }
            })
            else if (targetItem.id === get(sourceItem, [targetItem.dbClass, 'id'])) {
                set(sourceItem, targetItem.dbClass, targetItem)
                mutator.update(setItemSysProps(sourceItem))
            }
        }
        // backward refs
        if (sourceItem.backRefs.includes(targetItem.dbClass)) {
            const sourceTargetItems: RItem[] = get(sourceItem, [targetItem.dbClass]) || []
            if (sourceItemId === get(targetItem, [sourceItem.dbClass, 'id'])) {
                const index = sourceTargetItems.map(i => i.id).indexOf(targetItem.id)
                if (index !== -1) sourceTargetItems[index] = targetItem
                else sourceTargetItems.push(targetItem)
            }
            sourceItem[targetItem.dbClass] = sourceTargetItems
            mutator.update(setItemSysProps(sourceItem))
        }
    })
}