import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import createUser from "../../../../../libs/createUser/v0.6.0/createUser"
import mCreate from "../../../../../libs/mCreate/v0.1.0/mCreate"

export default {
  signals: {
    create: (noodlNode: NoodlNode) => {
      const { unique, map } = window.R.libs.just
      const { isNil } = window.R.libs.lodash
      const { createScheme } = noodlNode.resultProps

      sendOutput(noodlNode, 'creating', true)

      const orders = unique(createScheme.map((i: CreateScheme4) => i.order)).sort()
      const createPromise = (scheme: CreateScheme4) => mCreate(scheme)
      const createUserPromise = (scheme: CreateUser6) => createUser(scheme)
      const schemeArrays = orders.map(order => {
        return createScheme.filter((i: CreateScheme4) => i.order === order)
      })

      async function executeArrays() {
        let results: { [dbClass: string]: any[] } = {};
        for (const schemeArray of schemeArrays) {
          const arrayResults = await Promise.all(schemeArray.map((scheme: CreateScheme4) => {
            // save refId for next order            
            if (scheme.items.some(i => !isNil(i.refId))) {
              results[scheme.dbClass] = scheme.items.map(i => ({ refId: i.refId }))
              scheme.items = scheme.items.map(i => {
                delete i.refId
                return i
              })
            }
            // add ref from prev order            
            scheme.items.forEach((item: any) => {
              map(item, (k, v: any) => {
                if (!isNil(v.refId)) {
                  const refId = results[k]?.find(i => i.refId === v.refId)?.id
                  if (refId) item[k] = { id: refId }
                  delete v.refId
                }
              })
            })
            if (scheme.dbClass === 'user') return Promise.all(scheme.items.map((user: any, idx) => createUserPromise(user).then(user => ({
              ...user, refId: results[scheme.dbClass]?.[idx].refId
            }))))
            else return createPromise(scheme).then(items => items?.map((i, idx) => ({
              ...i, refId: results[scheme.dbClass]?.[idx].refId
            })))
          }))

          schemeArray.forEach((scheme: CreateScheme4, idx: number) => results[scheme.dbClass] = arrayResults[idx])
        }
        sendOutput(noodlNode, 'createdData', results)
        sendSignal(noodlNode, 'created')
        sendOutput(noodlNode, 'creating', false)
      }

      executeArrays().catch((error) => console.error(error))
    }
  }
}