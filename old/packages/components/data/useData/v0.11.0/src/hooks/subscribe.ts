import { useEffect } from "react"
import type { DataScheme } from "../../types"
import { dbClassVersion } from "@packages/get-dbclass-version"

export function subscribe(dataScheme: DataScheme) {
    const { dbName } = window.R.env
    const { dbClass, query } = dataScheme

    const { Kuzzle } = window.R.libs
    if (!Kuzzle) { log.error('No Kuzzle instance'); return }

    useEffect(() => {
        let roomId = ''
        const dbClassV = dbClassVersion(dbClass)
        if (dbName && dbClassV) Kuzzle.connect().then(() => Kuzzle.realtime.subscribe(dbName, dbClassV, query || {},
            notif => {
                if (notif.type !== 'document') return
                R.libs.queryClient?.invalidateQueries({ queryKey: [dataScheme] })
                log.info(`Subscribe - ${notif.action} ${dbClass}: `, notif.result)
            }
        ).then(rId => {
            roomId = rId
            log.info(`Subscribed to ${dbClass}`)
        })).catch((error) => log.info(`Subscribe error`, error))

        return () => {
            Kuzzle.realtime.unsubscribe(roomId)
                .then(() => log.info(`Unsubscribed from ${dbClass}`))
                .catch((error) => log.info(`Unsubscribe error`, error))
        }
    }, [])
}