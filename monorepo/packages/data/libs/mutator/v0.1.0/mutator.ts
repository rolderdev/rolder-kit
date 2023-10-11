import { setSorts } from "../../../utils/setDefaults/v0.3.0/setDefaults";
import { createMutatorStore } from "../../fetcher/v0.1.0/fetcher";

export default {
    updateItem(rItem: RItem, key?: string) {
        const mutatorStore = createMutatorStore<{ rItem: RItem, key?: string }>(
            async ({ data, getCacheUpdater }) => {
                const [updateCache, items] = getCacheUpdater<RItem[]>(data.key || '', false);
                if (items) {
                    items[items?.map(i => i.id).indexOf(data.rItem.id)] = data.rItem
                    updateCache([...items])
                }
            }
        )
        mutatorStore.mutate({ rItem: rItem, key })
    },
    addItem(rItem: RItem, key?: string, sorts?: any) {
        const sort = setSorts(rItem.dbClass, sorts)
        const mutatorStore = createMutatorStore<{ rItem: RItem, key?: string }>(
            async ({ data, getCacheUpdater }) => {
                const [updateCache, items] = getCacheUpdater<RItem[]>(data.key || '', false);
                if (items) {
                    let newItems = [...items, rItem]
                    newItems = window.R.libs.sort(newItems).by(sort?.map((s: any) => {
                        const order = s[Object.keys(s)[0]]
                        const key = Object.keys(s)[0]
                        return { [order]: (i: any) => window.R.utils.getValue.v7(i, key) }
                    }))
                    updateCache(newItems)
                }
            }
        )
        mutatorStore.mutate({ rItem: rItem, key })
    },
    removeItem(rItem: RItem, key?: string) {
        const mutatorStore = createMutatorStore<{ rItem: RItem, key?: string }>(
            async ({ data, getCacheUpdater }) => {
                const [updateCache, items] = getCacheUpdater<RItem[]>(data.key || '', false);
                if (items) updateCache(items.filter(i => i.id !== rItem.id))
            }
        )
        mutatorStore.mutate({ rItem: rItem, key })
    }
}