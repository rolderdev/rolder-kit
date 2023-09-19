import mUpdate from "../../../../../../libs/dataService/2_back/mutate/mUpdate/v0.2.0/mUpdate"
import updateUser from "../../../../../../libs/dataService/2_back/mutate/updateUser/v0.2.0/updateUser"
import { NodeInstance } from "../../../../../../main/getNodes/v0.5.0/types"
import { sendOutput, sendSignal } from "../../../../../../main/ports/send/v0.3.0/send"

const signals = {
  update: (node: NodeInstance) => {
    const { updateScheme, optimistic }: { updateScheme: MCreateUpdateScheme[], optimistic: boolean } = node._inputValues
    sendOutput(node, 'updating', true)

    const mUupdatePromise = (scheme: MCreateUpdateScheme) => mUpdate(scheme, optimistic)
    const updateUserPromise = (scheme: CreateUpdateUser) => updateUser(scheme, optimistic)
    if (updateScheme) {
      Promise.all(updateScheme.map((scheme: MCreateUpdateScheme) => {
        if (scheme.dbClass === 'user') return scheme.items.map((i: any) => updateUserPromise(i))
        else return mUupdatePromise(scheme)
      })).then((results: any) => {
        sendOutput(node, 'updatedData', results)
        sendSignal(node, 'updated')
        sendOutput(node, 'updating', false)
      })
    }
  }
}

export default signals