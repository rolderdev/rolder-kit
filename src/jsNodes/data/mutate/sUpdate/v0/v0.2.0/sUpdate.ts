import update from "../../../../../../libs/dataService/2_back/mutate/update/v0.4.0/update"
import updateUser from '../../../../../../libs/dataService/2_back/mutate/updateUser/v0.2.0/updateUser'
import { sendOutput, sendSignal } from "../../../../../../utils/noodl/send/v0.2.0/send"

const signals = {
  update: (noodlNode: NodeInstance) => {
    const { updateScheme, optimistic }: { updateScheme: CreateUpdateScheme[], optimistic: boolean } = noodlNode._inputValues
    sendOutput(noodlNode, 'updating', true)

    const updatePromise = (scheme: CreateUpdateScheme) => update(scheme, optimistic)
    const updateUserPromise = (scheme: CreateUpdateUser) => updateUser(scheme, optimistic)

    if (updateScheme) {
      Promise.all(updateScheme.map((scheme: CreateUpdateScheme) => {
        if (scheme.dbClass === 'user') return updateUserPromise(scheme)
        else return updatePromise(scheme)
      })).then((results: any) => {
        sendOutput(noodlNode, 'updatedData', results)
        sendSignal(noodlNode, 'updated')
        sendOutput(noodlNode, 'updating', false)
      })
    }
  }
}

export default signals