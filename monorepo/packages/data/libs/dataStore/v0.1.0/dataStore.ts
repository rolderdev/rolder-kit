import { FetcherStore } from "@nanostores/query"
import { createFetcherStore } from "../../fetcher/v0.1.0/fetcher"
import { getStoreKeys } from "../../fetcher/v0.1.0/keysFabric"

const stores: { [dbClass: string]: { [nodeId: string]: FetcherStore<RItem[]> } | undefined } = {}

export function createStore(
    noodlNodeId: string, dbClass: string, filters?: Filters, sorts?: Sorts, options?: Options, references?: string[], customReferences?: string[]
) {
    const { set } = window.R.libs.just
    const store = createFetcherStore<RItem[]>(getStoreKeys({ dbClass, filters, sorts, options, references, customReferences }))
    set(stores, [dbClass, noodlNodeId], store)
    return store
}

export function getStore(noodlNodeId: string, dbClass: string) {
    const { get } = window.R.libs.just
    let store: FetcherStore<RItem[]> = get(stores, [dbClass, noodlNodeId])
    return store
}

export function setItemRefs(rItem: any) {
    const { get } = window.R.libs.just
    rItem.refs?.forEach((refName: string) => {
        const isArray = Array.isArray(get(rItem, [refName]))
        if (isArray) {
            const refIds = get(rItem, [refName]).map((i: any) => i.id)
            const refItems: RItem[] = []
            refIds.forEach((refId: string) => {
                const refItem = get(window.R, ['items', refId])
                if (refItem) refItems.push(refItem)
            })
            if (refItems.length) rItem[refName] = refItems
        } else {
            const refId = get(rItem, [refName, 'id'])
            const refItem = get(window.R, ['items', refId])
            if (refItem) rItem[refName] = refItem
        }
    })
    return rItem
}

export function setItemCustomRefs(rItem: any) {
    const { get, map } = window.R.libs.just
    rItem.customRefs?.forEach((refName: string) => {
        const refItems: RItem[] = []
        map(window.R.items as any, (_itemId, item: RItem) => {
            if (item.dbClass === refName) {
                const refItemId = get(item, [rItem.dbClass, 'id'])
                if (refItemId) refItems.push(item)
            }
        })
        if (refItems.length) rItem[refName] = refItems
    })
    return rItem
}