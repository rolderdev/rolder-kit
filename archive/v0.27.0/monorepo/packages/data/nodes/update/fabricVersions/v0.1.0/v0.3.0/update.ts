import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import mUpdate from "../../../../../libs/mUpdate/v0.4.0/mUpdate"
import updateUser from "../../../../../libs/updateUser/v0.4.0/updateUser"

export default {
  signals: {
    update: (noodlNode: NoodlNode) => {
      const { unique } = window.R.libs.just
      const { updateScheme } = noodlNode.resultProps

      sendOutput(noodlNode, 'updating', true)

      const orders = unique(updateScheme.map((i: UpdateScheme4) => i.order)).sort()
      const mUpdatePromise = (scheme: UpdateScheme4) => mUpdate(scheme)
      const updateUserPromise = (scheme: UpdateUserScheme) => updateUser(scheme)
      const schemeArrays = orders.map(order => {
        return updateScheme.filter((i: UpdateScheme4) => i.order === order)
      })

      async function executeArrays() {
        let results: { [dbClass: string]: any[] } = {};
        for (const schemeArray of schemeArrays) {
          const arrayResults = await Promise.all(schemeArray.map((scheme: UpdateScheme4) => {
            if (scheme.dbClass === 'user') return Promise.all(scheme.items.map((i: any) => updateUserPromise(i)))
            else return mUpdatePromise(scheme)
          }))

          schemeArray.forEach((scheme: UpdateScheme4, idx: number) => results[scheme.dbClass] = arrayResults[idx])
        }
        sendOutput(noodlNode, 'updatedData', results)
        sendSignal(noodlNode, 'updated')
        sendOutput(noodlNode, 'updating', false)
      }

      executeArrays().catch((error) => console.error(error))
    }
  }
}