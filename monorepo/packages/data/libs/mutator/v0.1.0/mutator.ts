import { setSorts } from "../../../utils/setDefaults/v0.3.0/setDefaults";
import { createMutatorStore } from "../../fetcher/v0.1.0/fetcher";
import { setRefsFromItem } from "../../setRefs/v0.6.0/setRefs";

const mutator = {
    update(rItem: RItem) {
        const mutatorStore = createMutatorStore<{ rItem: RItem }>(async ({ data, getCacheUpdater }) => {
            const [updateCache, items] = getCacheUpdater<RItem[]>(data.rItem.storeKey, false);
            if (items) {
                setRefsFromItem(rItem)
                items[items?.map(i => i.id).indexOf(data.rItem.id)] = data.rItem
                updateCache([...items])
            }
        })
        mutatorStore.mutate({ rItem })
    },
    add(rItem: RItem, sorts?: any) {
        const sort = setSorts(rItem.dbClass, sorts)
        const mutatorStore = createMutatorStore<{ rItem: RItem }>(async ({ data, getCacheUpdater }) => {
            const [updateCache, items] = getCacheUpdater<RItem[]>(data.rItem.storeKey, false);
            if (items) {
                let newItems = [...items, rItem]
                newItems = window.R.libs.sort(newItems).by(sort?.map((s: any) => {
                    const order = s[Object.keys(s)[0]]
                    const key = Object.keys(s)[0]
                    return { [order]: (i: any) => window.R.utils.getValue.v7(i, key) }
                }))
                updateCache(newItems)
            }
        })
        mutatorStore.mutate({ rItem })
    },
    remove(rItem: RItem) {
        const mutatorStore = createMutatorStore<{ rItem: RItem, }>(async ({ data, getCacheUpdater }) => {
            const [updateCache, items] = getCacheUpdater<RItem[]>(data.rItem.storeKey, false);
            if (items) updateCache(items.filter(i => i.id !== rItem.id))
        })
        mutatorStore.mutate({ rItem })
        delete window.R.items[rItem.id]
    }
}
window.R.libs.mutator = mutator
export default mutator