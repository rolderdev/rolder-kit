import { Notification } from "kuzzle-sdk"
import { dbClassVersion, dbVersion } from "../../../utils/getVersion/v0.3.0/getVersion"
import { FetcherStore } from "@nanostores/query"
import { log } from "../../../../../utils/debug/log/v0.2.0/log"
import mutator from "../../mutator/v0.1.0/mutator"
import getRItems from "../../../utils/setItems/v0.2.0/setItems"

let roomIds: { [storeKey: string]: string } = {}

export function subscribe(
    store: FetcherStore<RItem[]>, dbClass: string, sorts: Sorts, filters: Filters, references?: string, backReferences?: string
) {
    const { Kuzzle } = window.R.libs
    Kuzzle.connect().then(() => {
        const roomId = store.key ? roomIds[store.key] || '' : ''
        Kuzzle.realtime.count(roomId).then((connectionsCount: number) => {
            if (connectionsCount === 0) {
                Kuzzle.realtime.subscribe(dbVersion(), dbClassVersion(dbClass), filters || {},
                    (notif: Notification) => {
                        if (notif.type !== 'document') return
                        const rItem = getRItems(
                            dbClass, store.key, [notif.result] as KItem[], JSON.stringify(references), JSON.stringify(backReferences)
                        )?.[0]
                        if (rItem) switch (notif.action) {
                            case 'update': store.invalidate(); break
                            //case 'update': mutator.update(rItem); break
                            case 'create': mutator.add(rItem, sorts); break
                            case 'delete': mutator.remove(rItem); break
                        }
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
        Kuzzle.realtime.unsubscribe(roomId).then(() => {
            Kuzzle.realtime.count(roomId).then((connectionsCount: number) => {
                if (connectionsCount === 0) delete roomIds[storeKey]
            }).catch(() => { })
        }).catch(() => { })
    }
}