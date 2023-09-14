import unique from "just-unique"
import { sendOutput, sendSignal } from "../../../../../../utils/noodl/send/v0.2.0/send"
import create from "../../../../../../libs/dataService/2_back/mutate/create/v0.3.0/create"
import createUser from '../../../../../../libs/dataService/2_back/mutate/createUser/v0.4.0/createUser'

const signals = {
  create: (noodlNode: NodeInstance) => {
    const { createScheme }: { createScheme: CreateUpdateScheme[] } = noodlNode._inputValues
    sendOutput(noodlNode, 'creating', true)

    const orders = unique(createScheme.map(i => i.order)).sort()
    const createPromise = (scheme: CreateUpdateScheme) => create(scheme)
    const createUserPromise = (scheme: CreateUpdateScheme) => createUser(scheme)
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
      sendOutput(noodlNode, 'createdData', results)
      sendSignal(noodlNode, 'created')
      sendOutput(noodlNode, 'creating', false)
    }

    executeArrays().catch((error) => console.error(error))
  }
}

export default signals