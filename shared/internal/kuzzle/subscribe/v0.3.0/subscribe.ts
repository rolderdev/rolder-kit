import { deepMap } from "nanostores"
import { getKuzzle } from "@shared/get-kuzzle"

const subs = deepMap<{ [dbClass: string]: string }>({})

export async function subscribe(dbClass: string) {
    const { dbName } = window.R.env
    if (!dbName) { return }

    const K = getKuzzle()
    if (!K) { return }

    if (!subs.get()[dbClass]) K.realtime.subscribe(dbName, dbClass, {}, notif => {
        if (notif.type !== 'document') return

        R.libs.queryClient?.invalidateQueries({
            predicate: (query: any) => {
                const dbClasses = query.queryKey[0]?.map((i: any) => i.dbClass)
                if (dbClasses?.length) return dbClasses.includes(dbClass)
                else return false
            }
        })

        log.info(`Subscribe - ${notif.action} ${dbClass}: `, notif.result)
    }).then(room => {
        subs.setKey(dbClass, room)

        log.info(`Subscribed to ${dbClass}`)
    }).catch((error) => log.error(`Subscribe error`, error))
}