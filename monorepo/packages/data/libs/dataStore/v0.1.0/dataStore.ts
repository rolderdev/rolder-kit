import { FetcherStore } from "@nanostores/query"
import { createFetcherStore } from "../../fetcher/v0.1.0/fetcher"
import { getStoreKeys } from "../../fetcher/v0.1.0/keysFabric"

const stores: { [dbClass: string]: { [nodeId: string]: FetcherStore<RItem[]> } | undefined } = {}

export function createStore(
    noodlNodeId: string, dbClass: string, filters?: Filters, sorts?: Sorts, options?: Options, references?: string[], backReferences?: string[]
) {
    const { set } = window.R.libs.just
    const store = createFetcherStore<RItem[]>(getStoreKeys({ dbClass, filters, sorts, options, references, backReferences }))
    set(stores, [dbClass, noodlNodeId], store)
    return store
}

export function getStore(noodlNodeId: string, dbClass: string) {
    const { get } = window.R.libs.just
    let store: FetcherStore<RItem[]> = get(stores, [dbClass, noodlNodeId])
    return store
}