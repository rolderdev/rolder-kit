export function setItemRefs(rItem: any) {
    const { Noodl } = window
    const { map } = window.R.libs.just
    // forward refs    
    rItem.refs?.forEach((refDbClass: string) => {
        if (Array.isArray(rItem[refDbClass])) {
            rItem[refDbClass] = rItem[refDbClass].map((refIdItem: { id: string }) => {
                if (Noodl.Object.exists(refIdItem.id)) return Noodl.Objects[refIdItem.id]
                else return refIdItem
            })
        } else if (Noodl.Object.exists(rItem[refDbClass]?.id)) rItem[refDbClass] = Noodl.Objects[rItem[refDbClass]?.id]
    })
    // backward refs        
    rItem.backRefs?.forEach((refDbClass: string) => {
        const refItems: RItem[] = []
        map(window.Noodl.Object._models, (itemId, _refItem) => {
            const refNItem = Noodl.Objects[itemId]
            if (refNItem.dbClass === refDbClass && rItem.id === refNItem[rItem.dbClass]?.id) refItems.push(refNItem)
        })
        if (refItems.length) rItem[refDbClass] = refItems
    })
    return rItem
}

export function setRefsFromItem(targetItem: any) {
    const { Noodl } = window
    const { map } = window.R.libs.just

    let refNoodlNodeIds: string[] = []
    map(window.Noodl.Object._models, (sourceItemId, _sourceItem: any) => {
        const sourceNItem = Noodl.Objects[sourceItemId]

        // forward refs
        if (sourceNItem.refs?.includes(targetItem.dbClass)) {
            const targetIdItems = sourceNItem.get(targetItem.dbClass)
            if (Array.isArray(targetIdItems)) targetIdItems.forEach(targetIdItem => {
                if (targetItem.id === targetIdItem.id) {
                    targetIdItem = targetItem
                    if (!refNoodlNodeIds.includes(sourceNItem.noodlNodeId)) refNoodlNodeIds.push(sourceNItem.noodlNodeId)
                    //mutator.update(sourceItem)
                }
            })
            else if (targetItem.id === sourceNItem[targetItem.dbClass]?.id) {
                sourceNItem[targetItem.dbClass] = targetItem
                if (!refNoodlNodeIds.includes(sourceNItem.noodlNodeId)) refNoodlNodeIds.push(sourceNItem.noodlNodeId)
                //mutator.update(sourceItem)
            }
        }
        // backward refs
        if (sourceNItem.backRefs?.includes(targetItem.dbClass)) {
            const sourceTargetItems: RItem[] = sourceNItem.get(targetItem.dbClass) || []
            if (sourceItemId === targetItem.get(sourceNItem.dbClass)?.id) {
                const index = sourceTargetItems.map(i => i.id).indexOf(targetItem.id)
                if (index !== -1) sourceTargetItems[index] = targetItem
                else sourceTargetItems.push(targetItem)
            }
            sourceNItem[targetItem.dbClass] = sourceTargetItems
            //mutator.update(setItemSysProps(sourceItem))
        }
    })

    return refNoodlNodeIds
}