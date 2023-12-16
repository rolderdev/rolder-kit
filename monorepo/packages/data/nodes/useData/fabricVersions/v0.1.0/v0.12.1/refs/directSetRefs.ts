import { dataCache } from "../../../../../dataContext/fabricVersions/v0.1.0/v0.1.0/DataContext"
import { setBackRefs, setRefs } from "./setRefs"

export default function (dataContextId: string, dataScheme: DataScheme12) {
    let dataWithRefs = dataCache.get()[dataContextId]?.[dataScheme.dbClass]
    dataScheme.refs?.forEach(refDbClass => {
        if (refDbClass !== dataScheme.dbClass) {
            const refItems = dataCache.get()[dataContextId]?.[refDbClass]
            if (refItems?.length) dataWithRefs = setRefs(dataWithRefs, refDbClass, refItems)
        }
    })
    dataScheme.backRefs?.forEach(refDbClass => {
        if (refDbClass !== dataScheme.dbClass) {
            const refItems = dataCache.get()[dataContextId]?.[refDbClass]
            if (refItems?.length) dataWithRefs = setBackRefs(dataScheme.dbClass, dataWithRefs, refDbClass, refItems)
        }
    })
    return dataWithRefs
}