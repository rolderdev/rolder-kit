import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import debounce from 'just-debounce-it'
import search from "../../../../../libs/search/v0.5.0/search"
import { invalidatingStates, subscribeToStore, unbinders } from "../../../../../libs/dataStore/v0.2.0/dataStore"

let searchParams: SearchProps
let nNode: NoodlNode

const debounceSearch = debounce((searchString: string, noodlNodeId: string) => {
  search({ ...searchParams, searchString }, noodlNodeId).then((searchResults) => {    
    sendOutput(nNode, 'items', searchResults?.items)
    sendOutput(nNode, 'searching', false)
    sendSignal(nNode, 'founded')
  })
}, 350)

export const useDataNoodlNodes: { [nodeId: string]: NoodlNode } = {}

export default {
  onInputChange(noodlNode: NoodlNode) {
    const { dbClass, fetchOnMount, searchString, searchFields, sorts, useReferences, references, backReferences } = noodlNode.resultProps
    if (!useDataNoodlNodes[noodlNode.id]) useDataNoodlNodes[noodlNode.id] = noodlNode

    if (searchString?.length > 1) {
      searchParams = { dbClass, searchFields, sorts, useReferences, references, backReferences }
      nNode = noodlNode
      sendOutput(nNode, 'searching', true)
      debounceSearch(searchString, noodlNode.id)
    } else if (fetchOnMount) subscribeToStore(noodlNode)
  },
  signals: {
    fetch: (noodlNode: NoodlNode) => {
      if (!useDataNoodlNodes[noodlNode.id]) useDataNoodlNodes[noodlNode.id] = noodlNode
      const store = subscribeToStore(noodlNode)
      store.invalidate()
    },
    refetch: (noodlNode: NoodlNode) => {
      if (!useDataNoodlNodes[noodlNode.id]) useDataNoodlNodes[noodlNode.id] = noodlNode
      invalidatingStates[noodlNode.id] = true
      const store = subscribeToStore(noodlNode)
      store.invalidate()
    }
  },
  onDelete(noodlNode: NoodlNode) {
    if (unbinders[noodlNode.id]) {
      unbinders[noodlNode.id]()
      delete unbinders[noodlNode.id]
    }
    if (useDataNoodlNodes[noodlNode.id]) delete useDataNoodlNodes[noodlNode.id]
  }
}