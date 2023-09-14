import { sendOutput, sendSignal } from "../../../../../../utils/noodl/v0.1.0/send"
import update from "../../../../../../libs/kuzzle/update/v0.3.0/update"
import updateUser from "../../../../../../libs/kuzzle/updateUser/v0.1.0/updateUser"

type UpdateScheme = {
  dbClass: string
  order: number
  id: string
  references: string[]
  body: Item
}

const signals = {
  update: (noodlNode: NodeInstance) => {
    const { updateScheme }: { updateScheme: UpdateScheme[] } = noodlNode._inputValues
    sendOutput({ noodlNode, portName: 'updating', value: true })

    const updatePromise = (scheme: UpdateScheme) => update(scheme.dbClass, scheme.id, scheme.body)
    const updateUserPromise = (scheme: UpdateScheme) => updateUser(scheme.id, scheme.body, { refresh: 'wait_for' })
    
    async function executeArrays() {
      let results: any = {};
      results = await Promise.all(updateScheme.map((scheme: any) => {
        const refs: string[] = scheme.references
        if (refs) refs.forEach(ref => scheme.body[ref] = { ...scheme.body[ref], id: results[ref]?.id })
        if (scheme.dbClass === 'user') return updateUserPromise(scheme)
        else return updatePromise(scheme)
      }))
      updateScheme.forEach((scheme, idx) => results[scheme.dbClass] = updateScheme[idx])

      sendOutput({ noodlNode, portName: 'updatedData', value: results })
      sendSignal({ noodlNode, portName: 'updated' })
      sendOutput({ noodlNode, portName: 'updating', value: false })
    }

    executeArrays().catch((error) => console.error(error))
  }
}

export default signals