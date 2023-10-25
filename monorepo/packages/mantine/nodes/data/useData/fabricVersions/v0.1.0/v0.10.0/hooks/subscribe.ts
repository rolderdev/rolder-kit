import { Notification } from "kuzzle-sdk"
import { dbClassVersion, dbVersion } from "../../../../../../../../data/utils/getVersion/v0.3.0/getVersion"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { log } from "../../../../../../../../../utils/debug/log/v0.2.0/log"
import setItems from "../utils/setItems"

export function subscribe(queryKey: QueryKey, noodlNodeId: string) {
    const { Kuzzle } = window.R.libs
    const { dbClass, filters } = queryKey
    const queryClient = useQueryClient()

    useEffect(() => {
        let roomId = ''
        Kuzzle.connect().then(() => Kuzzle.realtime.subscribe(dbVersion(), dbClassVersion(dbClass), filters || {},
            (notif: Notification) => {

                if (notif.type !== 'document') return
                if (notif.action === 'update') {
                    queryClient.setQueriesData([queryKey], (oldData: any) => {
                        const update = (oldRItem: RItem) => {
                            if (oldRItem.id === notif.result._id) {
                                const newRItem = { id: notif.result._id, ...notif.result._source } as RItem
                                setItems([newRItem], dbClass, noodlNodeId, queryKey.refs, queryKey.backRefs)
                                return newRItem
                            } else return oldRItem
                        }
                        return Array.isArray(oldData)
                            ? oldData.map(update)
                            : update(oldData)
                    })
                }
                queryClient.invalidateQueries({ queryKey: [queryKey] })

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