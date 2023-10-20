import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import debounce from 'just-debounce-it'
import search from "../../../../../libs/search/v0.5.0/search"
import { subscribeToStore, unbinders } from "../../../../../libs/dataStore/v0.1.0/dataStore"

let searchParams: SearchProps
let nNode: NoodlNode

const debounceSearch = debounce((searchString: string) => {
  search({ ...searchParams, searchString }).then((searchResults) => {
    sendOutput(nNode, 'items', searchResults?.items?.map(i => window.Noodl.Object.create(i)))
    sendOutput(nNode, 'searching', false)
    sendSignal(nNode, 'founded')
  })
}, 350)

export default {
  onInputChange(noodlNode: NoodlNode) {
    const { dbClass, fetchOnMount, searchString, searchFields, sorts, useReferences, references, backReferences } = noodlNode.resultProps
    if (searchString?.length > 1) {
      searchParams = { dbClass, searchFields, sorts, useReferences, references, backReferences }
      nNode = noodlNode
      sendOutput(nNode, 'searching', true)
      debounceSearch(searchString)
    } else if (fetchOnMount) subscribeToStore(noodlNode)
  },
  signals: {
    fetch: (noodlNode: NoodlNode) => {
      const store = subscribeToStore(noodlNode)
      store.invalidate()
    }
  },
  onDelete(noodlNode: NoodlNode) {
    if (unbinders[noodlNode.id]) {
      unbinders[noodlNode.id]()
      delete unbinders[noodlNode.id]
    }
  }
}