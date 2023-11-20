import { dataCache } from "../molecules"
import { setBackRefs, setRefs } from "./setRefs"

export default function (noodlNodeId: string, scheme: DataScheme) {
    let dataWithRefs = dataCache.get()[noodlNodeId]?.[scheme.dbClass]
    scheme.refs?.forEach(refDbClass => {
        const refItems = dataCache.get()[noodlNodeId]?.[refDbClass]
        if (refItems?.length) dataWithRefs = setRefs(dataWithRefs, refDbClass, refItems)
    })
    scheme.backRefs?.forEach(refDbClass => {
        const refItems = dataCache.get()[noodlNodeId]?.[refDbClass]
        if (refItems?.length) dataWithRefs = setBackRefs(scheme.dbClass, dataWithRefs, refDbClass, refItems)
    })
    dataCache.setKey(`${noodlNodeId}.${scheme.dbClass}`, dataWithRefs)
    return dataCache.get()[noodlNodeId]?.[scheme.dbClass]
}