import { sendOutput, sendSignal } from "../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { useDataNoodlNodes } from "../../../nodes/useData/fabricVersions/v0.1.0/v0.2.0/useData"
import createRItem from "../../createRItem/v0.1.0/createRItem"
import { setItemRefs, setRefsFromItem } from "../../setRefs/v0.7.0/setRefs"

export default function (
    dbClass: string, noodlNodeId: string, storeKey?: string, kItems?: KItem[], references?: string, backReferences?: string
): RItem[] | undefined {
    const { unique } = window.R.libs.just

    const refs: string[] = references ? JSON.parse(references) : []
    const backRefs: string[] = backReferences ? JSON.parse(backReferences) : []
    const rItems = kItems?.map(kItem => ({ id: kItem._id, ...kItem._source })) as RItem[]
    let refNoodlNodeIds: string[] = []
    
    const returnItems = rItems?.map(rItem => {
        const sysProps: ItemSysProps = { dbClass, noodlNodeId, storeKey: storeKey || '', refs, backRefs }
        rItem = createRItem(rItem, sysProps)
        rItem = setItemRefs(rItem)
        refNoodlNodeIds = refNoodlNodeIds.concat(setRefsFromItem(rItem))
        return rItem
    })

    unique(refNoodlNodeIds).forEach(noodlNodeId => {
        sendOutput(useDataNoodlNodes[noodlNodeId], 'items', useDataNoodlNodes[noodlNodeId].outputPropValues.items)
        sendSignal(useDataNoodlNodes[noodlNodeId], 'refetched')
    })

    return returnItems
}