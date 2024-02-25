import { dataCache, dataNodes, dataSchemes } from "@shared/data-context"
import { DataScheme } from "../../types"
import { setBackRefs, setRefs } from "./setRefs"
import { sendOutput } from "@shared/port-send"
import { action } from "nanostores"

export default action(dataCache, 'backwardSetRefs', (store, dataContextId: string, dataScheme: DataScheme) => {
    if (dataSchemes.get()[dataContextId]) {
        const refItems = store.get()[dataContextId]?.[dataScheme.dbClass]
        const schemes = Object.values(dataSchemes.get()[dataContextId])
        if (refItems?.length) schemes.filter(i => i.dbClass !== dataScheme.dbClass).forEach(scheme => {
            let items = store.get()[dataContextId]?.[scheme.dbClass]
            if (items?.length) {
                const ref = scheme.refs?.find(i => i === dataScheme.dbClass)
                if (ref) items = setRefs(items, ref, refItems)

                const backRef = scheme.backRefs?.find(i => i === dataScheme.dbClass)
                if (backRef) items = setBackRefs(scheme.dbClass, items, dataScheme.dbClass, refItems)

                const noodlNode = dataNodes.get()[dataContextId]?.[scheme.dbClass]
                sendOutput(noodlNode, 'items', items)
            }
        })
    }
})