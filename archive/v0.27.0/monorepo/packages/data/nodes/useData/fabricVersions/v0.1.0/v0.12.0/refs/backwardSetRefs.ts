import { sendOutput } from "../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { dataCache, dataNodes, dataSchemes } from "../../../../../dataContext/fabricVersions/v0.1.0/v0.1.0/DataContext"
import { setBackRefs, setRefs } from "./setRefs"

export default function (dataContextId: string, dataScheme: DataScheme12) {
    if (dataSchemes.get()[dataContextId]) {
        const refItems = dataCache.get()[dataContextId]?.[dataScheme.dbClass]
        const dss = Object.values(dataSchemes.get()[dataContextId])
        dss.forEach(targetDS => {
            if (targetDS.dbClass !== dataScheme.dbClass) {
                let targetItems = dataCache.get()[dataContextId]?.[targetDS.dbClass]
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
}