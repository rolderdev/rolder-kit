import { createScope, molecule } from "bunshi";
import { atom } from "jotai/vanilla";
import { deepMap } from "nanostores";
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send";

export const initialFetched = deepMap<{ [noodlNodeId: string]: boolean }>({})
export const dataCache = deepMap<{ [noodlNodeId: string]: DataCache12 }>({})
export const UseDataScope = createScope<{
    scopeId: Symbol, useDataScheme: DataScheme12[]
}>({ scopeId: Symbol(), useDataScheme: [] })

export const UseQueueMolecule = molecule((_, getScope) => {
    const { unique, flush } = window.R.libs.just
    const { useDataScheme } = getScope(UseDataScope)
    const orders = unique(flush(useDataScheme.map(i => i.order))).sort()
    const ordersCount = orders.map(order => useDataScheme.filter(i => i.order === order).length)

    const initialSchemesAtom = atom<DataScheme12[]>(useDataScheme)
    const currentOrderAtom = atom(orders[0])

    const orderCountAtom = atom(ordersCount[orders[0]])
    const decreaseOrderCountAtom = atom(null, (get, set) => {
        const orderCount = get(orderCountAtom)
        const newCount = orderCount - 1
        const newOrder = get(currentOrderAtom) + 1
        console.log(newCount, newOrder)
        if (newCount > 0) set(orderCountAtom, newCount)
        else if (ordersCount[newOrder]) {
            set(orderCountAtom, ordersCount[newOrder])
            set(currentOrderAtom, newOrder)
        } else {
            set(orderCountAtom, ordersCount[orders[0]])
            set(currentOrderAtom, orders[0])
        }
    })

    const fetchStateAtom = atom<boolean>(false)
    const runStatesAtom = atom<{ [dbClass: string]: boolean }>({})
    const setRunStatesAtom = atom(null, (get, set, noodlNode: NoodlNode, dbClass: string, isFetching: boolean) => {
        const { debounce } = window.R.libs.just

        const runStates = get(runStatesAtom)
        runStates[dbClass] = isFetching
        set(runStatesAtom, runStates)

        const values = Object.values(get(runStatesAtom))
        const inited = initialFetched.get()[noodlNode.id]

        if (values.some(i => i === true)) {
            if (!get(fetchStateAtom)) {
                set(fetchStateAtom, true)
                if (!inited) {
                    sendOutput(noodlNode, 'pending', true)
                } else sendOutput(noodlNode, 'fetching', true)
            }
        } else if (values.filter(i => i === false).length === useDataScheme.length) {
            const debState = debounce(() => {
                if (get(fetchStateAtom)) {
                    set(fetchStateAtom, false)
                    if (!inited) {
                        initialFetched.setKey(noodlNode.id, true)
                        sendOutput(noodlNode, 'pending', false)
                    } else sendOutput(noodlNode, 'fetching', false)
                    sendSignal(noodlNode, 'fetched')
                }
            }, useDataScheme.length * 50)
            debState()
        }
    })

    return { runStatesAtom, setRunStatesAtom, initialSchemesAtom, currentOrderAtom, decreaseOrderCountAtom }
})