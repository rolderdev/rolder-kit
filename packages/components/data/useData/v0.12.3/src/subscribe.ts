import { deepMap } from "nanostores"
import type { DataScheme } from "../types"
import { dbClassVersion } from "@packages/get-dbclass-version"

export const subs = deepMap<{ [noodlNodeId: string]: string }>({})

export async function subscribe(noodlNodeId: string, dataScheme: DataScheme, queryClient: any) {
    const { dbName } = window.R.env
    const { dbClass, filters } = dataScheme

    const { Kuzzle } = window.R.libs
    if (!Kuzzle) { log.error('No Kuzzle instance'); return }
    else {
        await unSubscribe(noodlNodeId, dbClass)
        setTimeout(() => {
            const dbClassV = dbClassVersion(dbClass)
            if (dbName && dbClassV) Kuzzle.realtime.subscribe(dbName, dbClassV, filters || {}, notif => {
                if (notif.type !== 'document') return
                queryClient.invalidateQueries({ queryKey: [dataScheme] })
                log.info(`Subscribe - ${notif.action} ${dbClass}: `, notif.result)
            }).then(room => {
                subs.setKey(noodlNodeId, room)
                log.info(`Subscribed to ${dbClass}`)
            }).catch((error) => console.log(`Subscribe error`, error))
        }, 500)
    }
}

export async function unSubscribe(noodlNodeId: string, dbClass: string) {
    const { Kuzzle } = window.R.libs
    if (!Kuzzle) { log.error('No Kuzzle instance'); return }
    else {
        try {
            const room = subs.get()[noodlNodeId]
            if (room) {
                await Kuzzle.realtime.unsubscribe(room)
                subs.setKey(noodlNodeId, '')
                log.info(`Unsubscribed from ${dbClass}`)
            } else subs.setKey(noodlNodeId, '')
        } catch { }// ignore duplicated unsubs
    }
}