import { sendOutput } from "../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { useDataNoodlNodes } from "../../../nodes/useData_old/fabricVersions/v0.1.0/v0.3.0/useData"
import getSysProps from "../../getSysProps/v0.1.0/getSysProps"
import { setItemRefs, setRefsFromItem } from "../../setRefs/v0.7.0/setRefs"

export default function (
    dbClass: string, noodlNodeId: string, kItem: KItem, storeKey?: string, references?: string[], backReferences?: string[]
) {
    const { unique } = window.R.libs.just

    const refs: string[] = references || []
    const backRefs: string[] = backReferences || []
    const rItem = { id: kItem._id, ...kItem._source } as RItem
    const sysProps: ItemSysProps = { dbClass, noodlNodeId, storeKey: storeKey || '', refs, backRefs }
    const defindedProps = getSysProps(sysProps)
    const nItem = window.Noodl.Object.create(rItem)
    Object.defineProperties(nItem, defindedProps)
    setItemRefs(nItem)
    const refNoodlNodeIds = setRefsFromItem(nItem)
    unique(refNoodlNodeIds).forEach(noodlNodeId => {
        if (useDataNoodlNodes[noodlNodeId]) {
            sendOutput(useDataNoodlNodes[noodlNodeId], 'items', useDataNoodlNodes[noodlNodeId].outputPropValues.items)
        }
    })
}