import { Notification } from "kuzzle-sdk"
import { dbClassVersion, dbVersion } from "../../../utils/getVersion/v0.3.0/getVersion"
import { FetcherStore } from "@nanostores/query"
import { log } from "../../../../../utils/debug/log/v0.2.0/log"
import { refetchings } from "../../dataStore/v0.2.0/dataStore"
import setNItem from "../../../utils/setItems/v0.3.0/setNItem"

let roomIds: { [storeKey: string]: string } = {}

export function subscribe(
    store: FetcherStore<RItem[]>, dbClass: string, noodlNodeId: string, filters: Filters, references?: string[], backReferences?: string[]
) {
    const { Kuzzle } = window.R.libs
    Kuzzle.connect().then(() => {
        const roomId = store.key ? roomIds[store.key] || '' : ''
        Kuzzle.realtime.count(roomId).then((connectionsCount: number) => {
            if (connectionsCount === 0) {
                Kuzzle.realtime.subscribe(dbVersion(), dbClassVersion(dbClass), filters || {},
                    (notif: Notification) => {
                        if (notif.type !== 'document') return
                        refetchings[noodlNodeId] = true
                        setNItem(dbClass, noodlNodeId, notif.result as KItem, store.key, references, backReferences)
                        store.invalidate()
                        log(`Subscribe - ${notif.action} ${dbClass}: `, notif.result)
                    }
                ).then((roomId: string) => {
                    if (store.key) roomIds[store.key] = roomId
                    log(`Subscribed to ${dbClass}`)
                })
            }
        })
    })
}

export function unsubscribe(storeKey?: string) {
    const { Kuzzle } = window.R.libs
    if (storeKey) {
        const roomId = roomIds[storeKey]
        if (roomId) Kuzzle.realtime.unsubscribe(roomId).then(() => {
            Kuzzle.realtime.count(roomId).then((connectionsCount: number) => {
                if (connectionsCount === 0) delete roomIds[storeKey]
            }).catch(() => { })
        }).catch(() => { })
    }
}