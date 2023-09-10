import unique from "just-unique"
import create from "../../../../../libs/kuzzle/create/v0.3.0/create"
import { sendOutput, sendSignal } from "../../../../../utils/noodl/v0.1.0/send"
import createUser from "../../../../../libs/kuzzle/createUser/v0.3.0/createUser"

type CreateScheme = {
  dbClass: string,
  order: number,
  references: string[]
  body: Item
}

const signals = {
  create: (noodlNode: NodeInstance) => {
    const { createScheme }: { createScheme: CreateScheme[] } = noodlNode._inputValues
    sendOutput({ noodlNode, portName: 'creating', value: true })

    const orders = unique(createScheme.map(i => i.order)).sort()
    const createPromise = (scheme: CreateScheme) => create(scheme.dbClass, scheme.body)
    const createUserPromise = (scheme: CreateScheme) => createUser(scheme.body, { refresh: 'wait_for' })
    const schemeArrays = orders.map(order => {
      return createScheme.filter(i => i.order === order)
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
        schemeArray.forEach((scheme, idx) => results[scheme.dbClass] = arrayResults[idx])
      }
      sendOutput({ noodlNode, portName: 'createdData', value: results })
      sendSignal({ noodlNode, portName: 'created' })
      sendOutput({ noodlNode, portName: 'creating', value: false })
    }

    executeArrays().catch((error) => console.error(error))
  }
}

export default signals