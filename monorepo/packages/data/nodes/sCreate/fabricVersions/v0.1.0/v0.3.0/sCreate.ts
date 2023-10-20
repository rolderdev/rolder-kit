import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import create from "../../../../../libs/create/v0.4.0/create"
import createUser from "../../../../../libs/createUser/v0.5.0/createUser"

export default {
  signals: {
    create: (noodlNode: NoodlNode) => {
      const { unique } = window.R.libs.just
      const { createScheme } = noodlNode.resultProps

      sendOutput(noodlNode, 'creating', true)

      const orders = unique(createScheme.map((i: CreateScheme) => i.order)).sort()
      const createPromise = (scheme: CreateScheme) => create(scheme, scheme.kuzzleOptions)
      const createUserPromise = (scheme: CreateScheme) => createUser(scheme)
      const schemeArrays = orders.map(order => {
        return createScheme.filter((i: CreateScheme) => i.order === order)
      })

      async function executeArrays() {
        let results: any = {};
        for (const schemeArray of schemeArrays) {
          const arrayResults = await Promise.all(schemeArray.map((scheme: any) => {
            const refs: string[] = scheme.references
            if (refs) refs.forEach(ref => scheme.body[ref] = { ...scheme.body[ref], id: results[ref]?.id })
            if (scheme.dbClass === 'user') return createUserPromise(scheme)
            else return createPromise(scheme)
          }))
          schemeArray.forEach((scheme: CreateScheme, idx: number) => results[scheme.dbClass] = arrayResults[idx])
        }
        sendOutput(noodlNode, 'createdData', results)
        sendSignal(noodlNode, 'created')
        sendOutput(noodlNode, 'creating', false)
      }

      executeArrays().catch((error) => console.error(error))
    }
  }
}