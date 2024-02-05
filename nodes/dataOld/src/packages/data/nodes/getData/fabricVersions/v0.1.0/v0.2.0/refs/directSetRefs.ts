import { dataCache } from "../getData"
import { setBackRefs, setRefs } from "./setRefs"

export default function (noodlNodeId: string, dataScheme: DataScheme) {
    let dataWithRefs = dataCache.get()[noodlNodeId]?.[dataScheme.dbClass]
    dataScheme.refs?.forEach(refDbClass => {
        const refItems = dataCache.get()[noodlNodeId]?.[refDbClass]
        if (refItems?.length) dataWithRefs = setRefs(dataWithRefs, refDbClass, refItems)
    })
    dataScheme.backRefs?.forEach(refDbClass => {
        const refItems = dataCache.get()[noodlNodeId]?.[refDbClass]
        if (refItems?.length) dataWithRefs = setBackRefs(dataScheme.dbClass, dataWithRefs, refDbClass, refItems)
    })
    return dataWithRefs
}