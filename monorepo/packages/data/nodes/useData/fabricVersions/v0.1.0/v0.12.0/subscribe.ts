import { Notification } from "kuzzle-sdk"
import { useQueryClient } from "@tanstack/react-query"
import { dbClassVersion } from "../../../../../utils/getVersion/v0.5.0/getVersion"
import { log } from "../../../../../../../utils/debug/log/v0.2.0/log"
import { deepMap } from "nanostores"
import { useShallowEffect } from "@mantine/hooks"

const subscriptions = deepMap<{ [noodlNodeId: string]: { [dbClass: string]: { roomId: string, scheme?: DataScheme12 } } | undefined }>({})

function sub(queryClient: any, scheme: DataScheme12, noodlNodeId: string, decreaseOrderCount: any, roomId?: string,) {
    const { isNil } = window.R.libs.lodash
    const { Kuzzle } = window.R.libs
    const { dbName } = window.R.env
    const { dbClass, query } = scheme

    if (dbName) Kuzzle.connect().then(() => Kuzzle.realtime.subscribe(dbName, dbClassVersion(dbClass), query || {},
        (notif: Notification) => {
            if (notif.type !== 'document') return
            if (!isNil(scheme.order)) decreaseOrderCount()
            console.log('s')
            queryClient.invalidateQueries()
            log(`Subscribe - ${notif.action} ${dbClass}: `, notif.result)
        }
    ).then((rId: string) => {
        roomId = rId
        subscriptions.setKey(`${noodlNodeId}.${dbClass}`, { roomId, scheme })
        log(`Subscribed to ${dbClass}`, query)
    })).catch((error) => console.log(`Subscribe error`, error))
}

function unSub(roomId: string, dbClass: string) {
    const { Kuzzle } = window.R.libs
    Kuzzle.realtime.unsubscribe(roomId)
        .then(() => log(`Unsubscribed from ${dbClass}`))
        .catch(() => { })//console.log(`Unsubscribe error`, error))
}

export function subscribe(noodlNodeId: string, scheme: DataScheme12, fetched: boolean, enabled: boolean, decreaseOrderCount: any) {
    const deepEqual = window.R.libs.deepEqual
    const { dbClass, query } = scheme
    const queryClient = useQueryClient()
    const subscription = subscriptions.get()[noodlNodeId]?.[dbClass]

    let roomId = subscription?.roomId
    useShallowEffect(() => {
        if (enabled) {
            if (fetched && !roomId) {
                sub(queryClient, scheme, noodlNodeId, decreaseOrderCount, roomId)
            }
            if (fetched && roomId && !deepEqual(query, subscription?.scheme?.query)) {
                unSub(roomId, dbClass)
                sub(queryClient, scheme, noodlNodeId, roomId)
            }
        }
        return () => {
            if (roomId && fetched && !deepEqual(query, subscription?.scheme?.query)) unSub(roomId, dbClass)
        }
    }, [query, fetched, enabled])
}