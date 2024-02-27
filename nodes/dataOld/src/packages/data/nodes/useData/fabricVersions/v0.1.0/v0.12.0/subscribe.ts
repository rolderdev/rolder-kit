import { Notification } from "kuzzle-sdk"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { dbClassVersion } from "../../../../../utils/getVersion/v0.5.0/getVersion"
import { log } from "../../../../../../../utils/debug/log/v0.2.0/log"

export function subscribe(dataScheme: DataScheme12) {
    const { Kuzzle } = window.R.libs
    const { dbName } = window.R.env
    const { dbClass, filters } = dataScheme
    const queryClient = useQueryClient()

    useEffect(() => {
        let roomId = ''
        if (dbName) Kuzzle.connect().then(() => Kuzzle.realtime.subscribe(dbName, dbClassVersion(dbClass), filters || {},
            (notif: Notification) => {
                if (notif.type !== 'document') return
                queryClient.invalidateQueries({ queryKey: [dataScheme] })
                log(`Subscribe - ${notif.action} ${dbClass}: `, notif.result)
            }
        ).then((rId: string) => {
            roomId = rId
            log(`Subscribed to ${dbClass}`)
        })).catch((error) => console.log(`Subscribe error`, error))

        return () => {
            Kuzzle.realtime.unsubscribe(roomId)
                .then(() => log(`Unsubscribed from ${dbClass}`))
                .catch((error) => console.log(`Unsubscribe error`, error))
        }
    }, [queryClient])
}