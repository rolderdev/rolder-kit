import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import update from "../../../../../libs/update/v0.5.0/update"
import updateUser from "../../../../../libs/updateUser/v0.3.0/updateUser"

export default {
  signals: {
    update: (noodlNode: NoodlNode) => {
      const { updateScheme } = noodlNode.resultProps

      sendOutput(noodlNode, 'updating', true)

      const updatePromise = (scheme: UpdateScheme) => update(scheme, scheme.kuzzleOptions)
      const updateUserPromise = (scheme: UpdateUser) => updateUser(scheme)

      if (updateScheme) {
        Promise.all(updateScheme.map((scheme: UpdateScheme) => {
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
}