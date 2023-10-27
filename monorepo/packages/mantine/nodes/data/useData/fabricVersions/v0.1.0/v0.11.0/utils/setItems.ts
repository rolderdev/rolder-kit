import { sendOutput } from "../../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { UseDataNoodlNodes } from "../UseData"
import { setItemRefs, setRefsFromItem } from "./setRefs"

export default function (rItems: RItem[], dbClass: string, noodlNodeId: string, refs?: string[], backRefs?: string[]) {
    const { unique } = window.R.libs.just

    const sysProps: ItemSysProps = { dbClass, noodlNodeId, refs, backRefs }
    const defindedProps: any = {}
    const propNames = ['dbClass', 'noodlNodeId', 'refs', 'backRefs'] as const
    propNames.forEach(prop => {
        defindedProps[prop] = {
            value: sysProps[prop],
            writable: false,
            enumerable: false,
            configurable: true
        }
    })

    const nItems = rItems.map(i => window.Noodl.Object.create(i))
    let refNoodlNodeIds: string[] = []
    nItems?.map(nItem => {
        Object.defineProperties(nItem, defindedProps)
        setItemRefs(nItem)
        refNoodlNodeIds = refNoodlNodeIds.concat(setRefsFromItem(nItem))
    })

    unique(refNoodlNodeIds).forEach(noodlNodeId => {
        if (UseDataNoodlNodes[noodlNodeId]) {
            sendOutput(UseDataNoodlNodes[noodlNodeId], 'items', UseDataNoodlNodes[noodlNodeId].outputPropValues.items)
        }
    })

    return nItems
}