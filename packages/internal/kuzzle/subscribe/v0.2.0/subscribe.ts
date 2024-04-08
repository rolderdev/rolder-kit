import { deepMap } from "nanostores"
import type { FetchScheme } from "./types"
import { getKuzzle } from "@packages/get-kuzzle"

const subs = deepMap<{ [noodlNodeId: string]: { [dbClass: string]: string } }>({})

export async function subscribe(noodlNodeId: string, fetchScheme: FetchScheme) {
    const { dbName } = window.R.env
    if (!dbName) { return }

    const K = await getKuzzle()
    if (!K) { return }

    await unSubscribe(noodlNodeId, fetchScheme)
    await new Promise(resolve => setTimeout(resolve, 500));
    for (const fs of fetchScheme) {
        if (fs.dbClass) K.realtime.subscribe(dbName, fs.dbClass, {}, notif => {
            if (notif.type !== 'document') return
            R.libs.queryClient?.invalidateQueries({
                predicate: (query: any) => query.queryKey[0]?.map((i: any) => i.dbClass).includes(fs.dbClass)
            })
            log.info(`Subscribe - ${notif.action} ${fs.dbClass}: `, notif.result)
        }).then(room => {
            subs.setKey(`${noodlNodeId}.${fs.dbClass}`, room)
            log.info(`Subscribed to ${fs.dbClass}`, fetchScheme)
        }).catch((error) => log.error(`Subscribe error`, error))
    }
}

export async function unSubscribe(noodlNodeId: string, fetchScheme: FetchScheme) {
    const K = await getKuzzle()
    if (!K) { return }
    else {
        try {
            for (const fs of fetchScheme) {
                if (fs.dbClass) {
                    const room = subs.get()[noodlNodeId][fs.dbClass]
                    if (room) {
                        await K.realtime.unsubscribe(room)
                        subs.setKey(`${noodlNodeId}.${fs.dbClass}`, '')
                        log.info(`Unsubscribed from ${fs.dbClass}`)
                    } else subs.setKey(`${noodlNodeId}.${fs.dbClass}`, '')
                }
            }
        } catch { }// ignore duplicated unsubs
    }
}