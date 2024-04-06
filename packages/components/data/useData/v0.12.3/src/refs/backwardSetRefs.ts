import { dataCache, dataNodes, dataSchemes } from "@packages/data-context"
import type { DataScheme } from "../../types"
import { setBackRefs, setRefs } from "./setRefs"
import { sendOutput } from "@packages/port-send"
import { action } from "nanostores"

//@ts-ignore
export default action(dataCache, 'backwardSetRefs', (store, dataContextId: string, dataScheme: DataScheme) => {
    if (dataSchemes.get()[dataContextId]) {
        const refItems = store.get()[dataContextId]?.[dataScheme.dbClass]
        const targetDataSchemes = Object.values(dataSchemes.get()[dataContextId])
        targetDataSchemes.forEach(targetDS => {
            if (targetDS.dbClass !== dataScheme.dbClass) {
                let targetItems = store.get()[dataContextId]?.[targetDS.dbClass]
                const tagetRefs = targetDS.refs?.filter(i => dataScheme.dbClass === i)
                tagetRefs?.forEach(() => {
                    if (targetItems?.length) targetItems = setRefs(targetItems, dataScheme.dbClass, refItems)
                })
                const tagetBackRefs = targetDS.backRefs?.filter(i => dataScheme.dbClass === i)
                tagetBackRefs?.forEach(() => {
                    if (targetItems?.length) targetItems = setBackRefs(targetDS.dbClass, targetItems, dataScheme.dbClass, refItems)
                })
                if (targetItems?.length) {
                    const noodlNode = dataNodes.get()[dataContextId]?.[targetDS.dbClass]
                    sendOutput(noodlNode, 'items', targetItems)
                }
            }
        })
    }
})