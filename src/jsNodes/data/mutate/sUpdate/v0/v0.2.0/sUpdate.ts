import update from "../../../../../../libs/dataService/2_back/mutate/update/v0.4.0/update"
import updateUser from '../../../../../../libs/dataService/2_back/mutate/updateUser/v0.2.0/updateUser'
import { NodeInstance } from "../../../../../../main/getNodes/v0.5.0/types"
import { sendOutput, sendSignal } from "../../../../../../main/ports/send/v0.3.0/send"

const signals = {
  update: (node: NodeInstance) => {
    const { updateScheme, optimistic }: { updateScheme: CreateUpdateScheme[], optimistic: boolean } = node._inputValues
    sendOutput(node, 'updating', true)

    const updatePromise = (scheme: CreateUpdateScheme) => update(scheme, optimistic)
    const updateUserPromise = (scheme: CreateUpdateUser) => updateUser(scheme, optimistic)

    if (updateScheme) {
      Promise.all(updateScheme.map((scheme: CreateUpdateScheme) => {
        if (scheme.dbClass === 'user') return updateUserPromise(scheme)
        else return updatePromise(scheme)
      })).then((results: any) => {
        sendOutput(node, 'updatedData', results)
        sendSignal(node, 'updated')
        sendOutput(node, 'updating', false)
      })
    }
  }
}

export default signals