import { FetcherStore } from "@nanostores/query"
import { createFetcherStore } from "../../fetcher/v0.2.0/fetcher"
import { getStoreKeys } from "../../fetcher/v0.2.0/keysFabric"
import { sendOutput, sendSignal } from "../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { subscribe, unsubscribe } from "../../subscribe/v0.5.0/subscribe"

const stores: { [dbClass: string]: { [nodeId: string]: FetcherStore<RItem[]> } | undefined } = {}

function createStore(
    noodlNodeId: string, dbClass: string, filters?: Filters, sorts?: Sorts, options?: Options, references?: string[], backReferences?: string[],
    refetchOnFocus?: boolean, getUsers?: boolean
) {
    const { set } = window.R.libs.just
    //const storeOptions = { refetchOnReconnect: true, refetchOnFocus }
    //const interval = refetchInterval ? refetchInterval * 1000 : undefined

    const store = createFetcherStore<RItem[]>(
        getStoreKeys({ dbClass, noodlNodeId, filters, sorts, options, references, backReferences, getUsers }),
        { refetchOnReconnect: true, refetchOnFocus }
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
        refetchOnFocus?: boolean, subscribe?: boolean, getUsers?: boolean
    }
} = {}

function isParamsChanged(noodlNode: NoodlNode) {
    const { compare } = window.R.libs.just
    const { dbClass, filters, sorts, options, references, backReferences, refetchOnFocus, subscribe, getUsers } = noodlNode.resultProps
    const isParamsSame = compare(
        { dbClass, filters, sorts, options, references, backReferences, refetchOnFocus, subscribe, getUsers },
        storesPrams[noodlNode.id]
    )
    if (!isParamsSame) storesPrams[noodlNode.id] = {
        dbClass, filters, sorts, options, references, backReferences, refetchOnFocus, subscribe, getUsers
    }
    return !isParamsSame
}

export const unbinders: { [nodeId: string]: () => void } = {}
export const refetchings: { [nodeId: string]: boolean } = {}

export function subscribeToStore(noodlNode: NoodlNode) {
    const {
        dbClass, filters, subscribe: enableSubscribe, sorts, options, references, backReferences, refetchOnFocus, getUsers
    } = noodlNode.resultProps

    let exStore = getStore(noodlNode.id, dbClass)
    const paramsChanged = isParamsChanged(noodlNode)

    if (paramsChanged || exStore.lc === 0) {
        const store = createStore(noodlNode.id, dbClass, filters, sorts, options, references, backReferences, refetchOnFocus, getUsers)

        if (unbinders[noodlNode.id]) {
            unbinders[noodlNode.id]()
            delete unbinders[noodlNode.id]
        }

        unbinders[noodlNode.id] = store.listen(v => {
            //v // dummy call for case when no output connection            
            if (!v.loading) {
                sendOutput(noodlNode, 'items', v.data?.map(i => window.Noodl.Objects[i.id]))
                sendSignal(noodlNode, 'fetched')
                refetchings[noodlNode.id] ? sendOutput(noodlNode, 'refetching', false) : sendOutput(noodlNode, 'fetching', false)
                refetchings[noodlNode.id] = false
            } else refetchings[noodlNode.id] ? sendOutput(noodlNode, 'refetching', true) : sendOutput(noodlNode, 'fetching', true)
        })

        if (exStore) unsubscribe(exStore.key)
        if (enableSubscribe) subscribe(store, dbClass, noodlNode.id, filters, references, backReferences)
        else unsubscribe(store.key)

        return store
    } else return exStore
}