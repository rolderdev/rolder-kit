import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import mUpdate from "../../../../../libs/mUpdate/v0.3.0/mUpdate"
import updateUser from "../../../../../libs/updateUser/v0.3.0/updateUser"

export default {
  signals: {
    update: (noodlNode: NoodlNode) => {
      const { updateScheme } = noodlNode.resultProps

      sendOutput(noodlNode, 'updating', true)

      const mUpdatePromise = (scheme: MUpdateScheme) => mUpdate(scheme, scheme.kuzzleOptions)
      const updateUserPromise = (scheme: UpdateUser) => updateUser(scheme)
      if (updateScheme) {
        Promise.all(updateScheme.map((scheme: MUpdateScheme) => {
          if (scheme.dbClass === 'user') return scheme.items.map((i: any) => updateUserPromise(i))
          else return mUpdatePromise(scheme)
        })).then((results: any) => {
          sendOutput(noodlNode, 'updatedData', results)
          sendSignal(noodlNode, 'updated')
          sendOutput(noodlNode, 'updating', false)
        })
      }
    }
  }
}