import { sendOutput } from "../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { UseDataNoodlNodes, useDataCache } from "../UseData"

export function setItemRefs(nItem: any) {
    const { Noodl } = window
    const { map } = window.R.libs.just
    // forward refs        
    nItem.refs?.forEach((refDbClass: string) => {
        if (Array.isArray(nItem[refDbClass])) {
            nItem[refDbClass] = nItem[refDbClass].map((refIdItem: { id: string }) => {
                const refNItem = Noodl.Objects[refIdItem.id]
                if (refNItem) {
                    const refNodeItemExist = useDataCache.get()[refNItem.noodlNodeId]?.some(i => i.id === refNItem.id)
                    if (refNodeItemExist) return Noodl.Objects[refIdItem.id]
                } else return refIdItem
            })
        } else {
            const refNItem = Noodl.Objects[nItem[refDbClass]?.id]
            if (refNItem) {
                const refNodeItemExist = useDataCache.get()[refNItem.noodlNodeId]?.some(i => i.id === refNItem.id)
                if (refNodeItemExist) nItem[refDbClass] = Noodl.Objects[nItem[refDbClass]?.id]
            }
        }
    })
    // backward refs        
    nItem.backRefs?.forEach((refDbClass: string) => {
        const refItems: RItem[] = []
        map(window.Noodl.Object._models, (itemId, _refItem) => {
            const refNItem = Noodl.Objects[itemId]
            if (refNItem.dbClass === refDbClass && nItem.id === refNItem[nItem.dbClass]?.id) {
                const refNodeItemExist = useDataCache.get()[refNItem.noodlNodeId]?.some(i => i.id === refNItem.id)
                if (refNodeItemExist) refItems.push(refNItem)
            }
        })
        if (refItems.length) nItem[refDbClass] = refItems
    })
    return nItem
}

export function setRefsFromItem(targetNItem: any) {
    const { Noodl } = window
    const { map } = window.R.libs.just

    let refNoodlNodeIds: string[] = []
    map(window.Noodl.Object._models, (sourceItemId, _sourceItem: any) => {
        const sourceNItem = Noodl.Objects[sourceItemId]

        // forward refs
        if (sourceNItem.refs?.includes(targetNItem.dbClass)) {
            const targetIdItems = sourceNItem.get(targetNItem.dbClass)
            if (Array.isArray(targetIdItems)) targetIdItems.forEach(targetIdItem => {
                const refNodeItemExist = useDataCache.get()[sourceNItem.noodlNodeId]?.some(i => i.id === sourceNItem.id)
                if (targetNItem.id === targetIdItem?.id && refNodeItemExist) {
                    targetIdItem = targetNItem
                    if (!refNoodlNodeIds.includes(sourceNItem.noodlNodeId)) refNoodlNodeIds.push(sourceNItem.noodlNodeId)
                }
            })
            else if (targetNItem.id === sourceNItem[targetNItem.dbClass]?.id) {
                const refNodeItemExist = useDataCache.get()[sourceNItem.noodlNodeId]?.some(i => i.id === sourceNItem.id)
                if (refNodeItemExist) sourceNItem[targetNItem.dbClass] = targetNItem
                if (!refNoodlNodeIds.includes(sourceNItem.noodlNodeId)) refNoodlNodeIds.push(sourceNItem.noodlNodeId)
            }
        }
        // backward refs        
        if (sourceNItem.backRefs?.includes(targetNItem.dbClass)) {
            const sourceTargetItems: RItem[] = sourceNItem.get(targetNItem.dbClass) || []
            if (sourceItemId === targetNItem.get(sourceNItem.dbClass)?.id) {
                const refNodeItemExist = useDataCache.get()[targetNItem.noodlNodeId]?.some(i => i.id === targetNItem.id)
                const index = sourceTargetItems.map(i => i.id).indexOf(targetNItem.id)
                if (refNodeItemExist) {
                    if (index !== -1) sourceTargetItems[index] = targetNItem
                    else sourceTargetItems.push(targetNItem)
                }
            }
            sourceNItem[targetNItem.dbClass] = sourceTargetItems
            if (!refNoodlNodeIds.includes(sourceNItem.noodlNodeId)) refNoodlNodeIds.push(sourceNItem.noodlNodeId)
        }
    })

    return refNoodlNodeIds
}

export function setRefsFromItems(targetNItems: any, targetDbClass: string) {
    const { Noodl } = window
    const { map } = window.R.libs.just

    let refNoodlNodeIds: string[] = []
    map(window.Noodl.Object._models, (sourceItemId, _sourceItem: any) => {
        const sourceNItem = Noodl.Objects[sourceItemId]

        // forward refs
        /* if (sourceNItem.refs?.includes(targetDbClass)) {
            const targetIdItems = sourceNItem.get(targetDbClass)
            if (Array.isArray(targetIdItems)) targetIdItems.forEach(targetIdItem => {
                const refNodeItemExist = useDataCache.get()[sourceNItem.noodlNodeId]?.some(i => i.id === sourceNItem.id)
                if (targetNItem.id === targetIdItem?.id && refNodeItemExist) {
                    targetIdItem = targetNItem
                    if (!refNoodlNodeIds.includes(sourceNItem.noodlNodeId)) refNoodlNodeIds.push(sourceNItem.noodlNodeId)
                }
            })
            else if (targetNItem.id === sourceNItem[targetNItem.dbClass]?.id) {
                const refNodeItemExist = useDataCache.get()[sourceNItem.noodlNodeId]?.some(i => i.id === sourceNItem.id)
                if (refNodeItemExist) sourceNItem[targetNItem.dbClass] = targetNItem
                if (!refNoodlNodeIds.includes(sourceNItem.noodlNodeId)) refNoodlNodeIds.push(sourceNItem.noodlNodeId)
            }
        } */
        // backward refs        
        if (sourceNItem.backRefs?.includes(targetDbClass)) {
            const filteredTargetNItems = targetNItems.filter((i: any) => i[sourceNItem.dbClass].id === sourceNItem.id)
            console.log(targetDbClass, filteredTargetNItems)
            if (filteredTargetNItems?.length) sourceNItem[targetDbClass] = filteredTargetNItems.map((i: any) => window.Noodl.Objects[i.id])
            if (UseDataNoodlNodes[sourceNItem.noodlNodeId]) {
                sendOutput(UseDataNoodlNodes[sourceNItem.noodlNodeId], 'items', UseDataNoodlNodes[sourceNItem.noodlNodeId].outputPropValues.items)
            }
        }
    })

    return refNoodlNodeIds
}