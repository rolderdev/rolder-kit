import { dbClassVersion } from "../../../../../utils/getVersion/v0.5.0/getVersion"
import { log } from "../../../../../../../utils/debug/log/v0.2.0/log"
import { deepMap } from "nanostores"

export const subs = deepMap<{ [noodlNodeId: string]: string }>({})

export async function subscribe(noodlNodeId: string, dataScheme: DataScheme123) {
    const { Kuzzle, queryClient } = window.R.libs
    const { dbName } = window.R.env
    const { dbClass, filters } = dataScheme

    await unSubscribe(noodlNodeId, dbClass)
    setTimeout(() => {
        if (dbName) Kuzzle.realtime.subscribe(dbName, dbClassVersion(dbClass), filters || {}, notif => {
            if (notif.type !== 'document') return
            queryClient.invalidateQueries({ queryKey: [dataScheme] })
            log(`Subscribe - ${notif.action} ${dbClass}: `, notif.result)            
        }).then(room => {
            subs.setKey(noodlNodeId, room)            
            log(`Subscribed to ${dbClass}`)
        }).catch((error) => console.log(`Subscribe error`, error))
    }, 500)
}

export async function unSubscribe(noodlNodeId: string, dbClass: string) {
    const { Kuzzle } = window.R.libs

    try {
        const room = subs.get()[noodlNodeId]
        if (room) {
            await Kuzzle.realtime.unsubscribe(room)
            subs.setKey(noodlNodeId, '')
            log(`Unsubscribed from ${dbClass}`)            
        } else subs.setKey(noodlNodeId, '')
    } catch { }// ignore duplicated unsubs
}