import mUpdate from "../../../../../../libs/dataService/2_back/mutate/mUpdate/v0.2.0/mUpdate"
import updateUser from "../../../../../../libs/dataService/2_back/mutate/updateUser/v0.2.0/updateUser"
import { sendOutput, sendSignal } from "../../../../../../utils/noodl/send/v0.2.0/send"

const signals = {
  update: (noodlNode: NodeInstance) => {
    const { updateScheme, optimistic }: { updateScheme: MCreateUpdateScheme[], optimistic: boolean } = noodlNode._inputValues
    sendOutput(noodlNode, 'updating', true)

    const mUupdatePromise = (scheme: MCreateUpdateScheme) => mUpdate(scheme, optimistic)
    const updateUserPromise = (scheme: CreateUpdateUser) => updateUser(scheme, optimistic)
    if (updateScheme) {
      Promise.all(updateScheme.map((scheme: MCreateUpdateScheme) => {
        if (scheme.dbClass === 'user') return scheme.items.map((i: any) => updateUserPromise(i))
        else return mUupdatePromise(scheme)
      })).then((results: any) => {
        sendOutput(noodlNode, 'updatedData', results)
        sendSignal(noodlNode, 'updated')
        sendOutput(noodlNode, 'updating', false)
      })
    }
  }
}

export default signals