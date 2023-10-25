import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import update from "../../../../../libs/update/v0.5.0/update"
import updateUser from "../../../../../libs/updateUser/v0.3.0/updateUser"

export default {
  signals: {
    update: async (noodlNode: NoodlNode) => {
      const { updateScheme } = noodlNode.resultProps

      sendOutput(noodlNode, 'updating', true)

      if (updateScheme) {
        const userClassScheme: UpdateScheme = updateScheme.find((i: any) => i.dbClass === 'user')
        if (userClassScheme) await updateUser(userClassScheme)
        Promise.all(updateScheme.map((scheme: UpdateScheme) => {
          if (scheme.dbClass !== 'user') return update(scheme, scheme.kuzzleOptions)
        })).then((rItems: RItem[]) => {
          sendOutput(noodlNode, 'updatedData', rItems.filter(i => i).map(i => window.Noodl.Objects[i.id]))
          sendSignal(noodlNode, 'updated')
          sendOutput(noodlNode, 'updating', false)
        })
      }
    }
  }
}