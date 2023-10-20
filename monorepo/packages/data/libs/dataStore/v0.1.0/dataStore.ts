import { FetcherStore } from "@nanostores/query"
import { createFetcherStore } from "../../fetcher/v0.2.0/fetcher"
import { getStoreKeys } from "../../fetcher/v0.2.0/keysFabric"
import { sendOutput, sendSignal } from "../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { subscribe, unsubscribe } from "../../subscribe/v0.5.0/subscribe"

const stores: { [dbClass: string]: { [nodeId: string]: FetcherStore<RItem[]> } | undefined } = {}

function createStore(
    noodlNodeId: string, dbClass: string, filters?: Filters, sorts?: Sorts, options?: Options, references?: string[], backReferences?: string[],
    refetchOnFocus?: boolean
) {
    const { set } = window.R.libs.just

    const store = createFetcherStore<RItem[]>(
        getStoreKeys({ dbClass, filters, sorts, options, references, backReferences }),
        { refetchOnFocus }
    )
    set(stores, [dbClass, noodlNodeId], store)
    return store
}

function getStore(noodlNodeId: string, dbClass: string) {
    const { get } = window.R.libs.just
    let store: FetcherStore<RItem[]> = get(stores, [dbClass, noodlNodeId])
    return store
}

const storesPrams: {
    [nodeId: string]: {
        dbClass: string, filters?: Filters, sorts?: Sorts, options?: Options, references?: string[], backReferences?: string[],
        refetchOnFocus?: boolean, subscribe?: boolean
    }
} = {}

function isParamsChanged(noodlNode: NoodlNode) {
    const { compare } = window.R.libs.just
    const { dbClass, filters, sorts, options, references, backReferences, refetchOnFocus, subscribe } = noodlNode.resultProps
    const isParamsSame = compare(
        { dbClass, filters, sorts, options, references, backReferences, refetchOnFocus, subscribe },
        storesPrams[noodlNode.id]
    )
    if (!isParamsSame) storesPrams[noodlNode.id] = { dbClass, filters, sorts, options, references, backReferences, refetchOnFocus, subscribe }
    return !isParamsSame
}

export const unbinders: { [nodeId: string]: () => void } = {}

export function subscribeToStore(noodlNode: NoodlNode) {
    const { dbClass, filters, subscribe: enableSubscribe, sorts, options, references, backReferences, refetchOnFocus } = noodlNode.resultProps

    let store = getStore(noodlNode.id, dbClass)

    if (isParamsChanged(noodlNode)) {
        store = createStore(noodlNode.id, dbClass, filters, sorts, options, references, backReferences, refetchOnFocus)

        if (unbinders[noodlNode.id]) {
            unbinders[noodlNode.id]()
            delete unbinders[noodlNode.id]
        }

        unbinders[noodlNode.id] = store.listen(v => {
            v // dummy call for case when no output connection
            sendOutput(noodlNode, 'fetching', v.loading)
            if (!v.loading) {
                sendOutput(noodlNode, 'items', v.data)
                sendSignal(noodlNode, 'fetched')
            }
        })

        if (enableSubscribe) subscribe(store, dbClass, sorts, filters, references, backReferences)
        else unsubscribe(store.key)
    }

    return store
}