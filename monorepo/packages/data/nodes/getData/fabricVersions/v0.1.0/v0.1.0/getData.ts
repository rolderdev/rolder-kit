import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import fetch from './fetch'

export default {
  signals: {
    fetch: (noodlNode: NoodlNode) => {
      const { dbClass, filters, sorts, options } = noodlNode.resultProps
      sendOutput(noodlNode, 'fetching', true)
      fetch(dbClass, filters, sorts, options).then(rItems => {
        sendOutput(noodlNode, 'items', rItems)
        sendOutput(noodlNode, 'fetching', false)
        sendSignal(noodlNode, 'fetched')
      })
    },
  }
}