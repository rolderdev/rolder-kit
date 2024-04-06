import { dataCache } from "@packages/data-context"
import type { DataScheme } from "../../types"
import { setBackRefs, setRefs } from "./setRefs"
import { action } from "nanostores"

//@ts-ignore
export default action(dataCache, 'setRefs', (store, dataContextId: string, dataScheme: DataScheme) => {
    let dataWithRefs = store.get()[dataContextId]?.[dataScheme.dbClass]
    dataScheme.refs?.forEach(refDbClass => {
        if (refDbClass !== dataScheme.dbClass) {
            const refItems = store.get()[dataContextId]?.[refDbClass]
            if (refItems?.length) dataWithRefs = setRefs(dataWithRefs, refDbClass, refItems)

        }
    })
    dataScheme.backRefs?.forEach(refDbClass => {
        if (refDbClass !== dataScheme.dbClass) {
            const refItems = store.get()[dataContextId]?.[refDbClass]
            if (refItems?.length) dataWithRefs = setBackRefs(dataScheme.dbClass, dataWithRefs, refDbClass, refItems)
        }
    })

    return dataWithRefs
})