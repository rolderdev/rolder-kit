import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { subscribe, unsubscribe } from "../../../../../libs/subscribe/v0.4.0/subscribe"
import { createStore, getStore } from "../../../../../libs/dataStore/v0.1.0/dataStore"
import debounce from 'just-debounce-it'
import search from "../../../../../libs/search/v0.5.0/search"

const unbinders: { [nodeId: string]: () => void } = {}

function subscribeToStore(noodlNode: NoodlNode) {
  const { dbClass, filters, subscribe: enableSubscribe, sorts, options, references, customReferences } = noodlNode.resultProps

  const store = createStore(noodlNode.id, dbClass, filters, sorts, options, references, customReferences)
  unbinders[noodlNode.id] = store.listen(v => {
    sendOutput(noodlNode, 'items', v.data)
    sendOutput(noodlNode, 'fetching', v.loading)
    sendSignal(noodlNode, 'fetched')
  })

  if (enableSubscribe) subscribe(store, dbClass, sorts, filters, references, customReferences)
  else unsubscribe(store.key)

  return store
}

let searchParams: SearchProps
let nNode: NoodlNode

const debounceSearch = debounce((searchString: string) => {
  search({ ...searchParams, searchString }).then((searchResults) => {
    sendOutput(nNode, 'items', searchResults?.items)
    sendOutput(nNode, 'searching', false)
    sendSignal(nNode, 'founded')
  })
}, 350)

export default {
  onInputChange(noodlNode: NoodlNode) {
    const { dbClass, fetchOnMount, searchString, searchFields, sorts, useReferences, references, customReferences } = noodlNode.resultProps
    if (searchString?.length > 1) {
      searchParams = { dbClass, searchFields, sorts, useReferences, references, customReferences }
      nNode = noodlNode
      sendOutput(nNode, 'searching', true)
      debounceSearch(searchString)
    } else {
      let store = getStore(noodlNode.id, dbClass)
      if (fetchOnMount && (!store || !unbinders[noodlNode.id])) subscribeToStore(noodlNode)
    }
  },
  signals: {
    fetch: (noodlNode: NoodlNode) => {
      const { dbClass, fetchOnMount } = noodlNode.resultProps
      const store = getStore(noodlNode.id, dbClass)
      if (!fetchOnMount && (!store || !unbinders[noodlNode.id])) subscribeToStore(noodlNode)
      else if (store) store.invalidate()
    }
  },
  onDelete(noodlNode: NoodlNode) {
    if (unbinders[noodlNode.id]) {
      unbinders[noodlNode.id]()
      delete unbinders[noodlNode.id]
    }
  }
}