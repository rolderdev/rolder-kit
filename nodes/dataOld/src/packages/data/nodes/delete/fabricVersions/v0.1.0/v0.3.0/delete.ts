import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import mDelete from "../../../../../libs/mDelete/v0.3.0/mDelete"
import mDeleteUsers from "../../../../../libs/mDeleteUsers/v0.3.0/mDeleteUsers"

export default {
  signals: {
    delete: (noodlNode: NoodlNode) => {
      const { deleteScheme } = noodlNode.resultProps

      sendOutput(noodlNode, 'deleting', true)

      const mDeletePromise = (scheme: DeleteScheme3) => mDelete(scheme)
      const mDeleteUsersPromise = (deleteUserIds: string[]) => mDeleteUsers(deleteUserIds)

      if (deleteScheme) {
        Promise.all(deleteScheme.map((scheme: DeleteScheme3) => {
          if (scheme.dbClass === 'user') return mDeleteUsersPromise(scheme.ids)
          else return mDeletePromise(scheme)
        })).then(() => {
          sendSignal(noodlNode, 'deleted')
          sendOutput(noodlNode, 'deleting', false)
        })
      }
    }
  }
}