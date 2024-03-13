import { deepMap } from "nanostores"
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import fetch from "./fetchers/fetch"
import directSetRefs from "./refs/directSetRefs"
import sendUseDataOutput from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/sendUseDataOutput"
import backwardSetRefs from "./refs/backwardSetRefs"
import filterBy from "./parsers/filterBy"

export const dataCache = deepMap<{ [noodleNodeId: string]: DataCache }>({})

export default {
  signals: {
    fetch: (noodlNode: NoodlNode) => {
      const { unique } = window.R.libs.just
      const getDataScheme: GetDataScheme2[] = noodlNode.resultProps.getDataScheme

      sendOutput(noodlNode, 'fetching', true)

      const orders = unique(getDataScheme.map((i: GetDataScheme2) => i.order)).sort()
      const schemeArrays = orders.map(order => {
        return getDataScheme.filter((i: GetDataScheme2) => i.order === order)
      })

      async function executeArrays() {
        for (const schemeArray of schemeArrays) {
          await Promise.all(schemeArray.map((dataScheme: GetDataScheme2) => {
            if (dataScheme.filterBy) { filterBy(noodlNode.id, dataScheme) }
            return fetch(dataScheme).then(rItems => {
              dataCache.setKey(`${noodlNode.id}.${dataScheme.dbClass}`, rItems || [])
              let dataWithRefs = directSetRefs(noodlNode.id, dataScheme)
              sendUseDataOutput(noodlNode, dataScheme.dbClass, dataWithRefs)
              sendSignal(noodlNode, 'fetched')
              dataCache.setKey(`${noodlNode.id}.${dataScheme.dbClass}`, dataWithRefs || [])
              backwardSetRefs(noodlNode, getDataScheme, dataScheme)
              sendOutput(noodlNode, 'fetching', false)
            })
          }))
        }
      }

      executeArrays().catch((error) => console.error(error))
    },
  }
}