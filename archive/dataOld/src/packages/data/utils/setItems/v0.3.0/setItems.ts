import { sendOutput } from "../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { useDataNoodlNodes } from "../../../nodes/useData_old/fabricVersions/v0.1.0/v0.3.0/useData"
import getSysProps from "../../getSysProps/v0.1.0/getSysProps"
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
        const defindedProps = getSysProps(sysProps)
        const nItem = window.Noodl.Object.create(rItem)
        Object.defineProperties(rItem, defindedProps)
        Object.defineProperties(nItem, defindedProps)
        setItemRefs(nItem)
        refNoodlNodeIds = refNoodlNodeIds.concat(setRefsFromItem(nItem))
        return rItem
    })

    unique(refNoodlNodeIds).forEach(noodlNodeId => {
        if (useDataNoodlNodes[noodlNodeId]) {
            sendOutput(useDataNoodlNodes[noodlNodeId], 'items', useDataNoodlNodes[noodlNodeId].outputPropValues.items)
        }
    })

    return returnItems
}