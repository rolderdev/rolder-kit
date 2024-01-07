import { setSorts } from "../../../utils/setDefaults/v0.3.0/setDefaults";
import { setRefsFromItem } from "../../../utils/setRefs/v0.7.0/setRefs";
import { createMutatorStore } from "../../fetcher/v0.2.0/fetcher";

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
            let newItems = [...items || [], rItem]
            newItems = window.R.libs.sort(newItems).by(sort?.map((s: any) => {
                const order = s[Object.keys(s)[0]]
                const key = Object.keys(s)[0]
                return { [order]: (i: any) => window.R.utils.getValue.v7(i, key) }
            }))
            updateCache(newItems)
        })
        mutatorStore.mutate({ rItem })
    },
    remove(rItem: RItem) {
        const mutatorStore = createMutatorStore<{ rItem: RItem, }>(async ({ data, getCacheUpdater }) => {
            const [updateCache, items] = getCacheUpdater<RItem[]>(data.rItem.storeKey, false);
            const filteredItems = items?.filter(i => i.id !== rItem.id)
            items?.length !== 0 && items?.length !== filteredItems && updateCache(filteredItems)
        })
        mutatorStore.mutate({ rItem })
    }
}
window.R.libs.mutator = mutator
export default mutator