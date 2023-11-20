import { useMolecule } from "bunshi/react"
import { createStore } from "jotai/vanilla";
import { useAtomValue, useSetAtom } from "jotai"
import { UseQueueMolecule, dataCache } from "./molecules"

export const store = createStore()
export const useSetRunStates = () => {
    const { setRunStatesAtom } = useMolecule(UseQueueMolecule)
    return useSetAtom(setRunStatesAtom, { store })
}
export const useInitialSchemes = () => {
    const { initialSchemesAtom } = useMolecule(UseQueueMolecule)
    return useAtomValue(initialSchemesAtom, { store })
}
export const useCurrentOrder = () => {
    const { currentOrderAtom } = useMolecule(UseQueueMolecule)
    return useAtomValue(currentOrderAtom, { store })
}
export const useDecreaseOrderCount = () => {
    const { decreaseOrderCountAtom } = useMolecule(UseQueueMolecule)
    return useSetAtom(decreaseOrderCountAtom, { store })
}

export const useScheme = (noodlNodeId: string, initialScheme: DataScheme12) => {
    const { getValue } = window.R.utils
    const { flush, unique } = window.R.libs.just

    const currentOrder = useCurrentOrder()
    const enabledByOrder = initialScheme.order === currentOrder
    let enabledByFilters = true

    if (enabledByOrder) {
        let newScheme: DataScheme12 = { ...initialScheme }
        initialScheme.filterBy?.forEach(filterScheme => {
            const { dbClassAccessor, filterByDbClass, filterByAccessor } = filterScheme

            const filterByData = unique(flush(dataCache.get()?.[noodlNodeId]?.[filterByDbClass]?.map((i: any) => {
                const rootKey = filterByAccessor.split('.')[0]
                if (rootKey && Array.isArray(i[rootKey])) {
                    const arrayAccesor = filterByAccessor.split('.').slice(1).toString()
                    return i[rootKey].map((i: any) => getValue.v8(i, arrayAccesor))
                } else return getValue.v8(i, filterByAccessor)
            }))?.flat())

            if (filterByData?.length) {
                let filter: any = { in: { [dbClassAccessor]: filterByData } }
                if (dbClassAccessor === 'id') filter = { ids: { values: filterByData } }
                if (!initialScheme.query) newScheme.query = filter
                else if (!initialScheme.query.and) {
                    newScheme.query = { and: [initialScheme.query, filter] }
                } else newScheme.query?.and.push(filter)
            } else enabledByFilters = false
        })
        return { scheme: newScheme, enabled: enabledByOrder && enabledByFilters }
    } else return { enabled: false, scheme: initialScheme }
}