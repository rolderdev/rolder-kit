import { Notification } from "kuzzle-sdk"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import setItems from "../utils/setItems"
import { dbClassVersion } from "../../../../../../utils/getVersion/v0.5.0/getVersion"
import { log } from "../../../../../../../../utils/debug/log/v0.2.0/log"

export function subscribe(queryKey: QueryKey, noodlNodeId: string) {
    const { Kuzzle } = window.R.libs
    const { dbName } = window.R.env
    const { dbClass, filters } = queryKey
    const queryClient = useQueryClient()

    useEffect(() => {
        let roomId = ''
        if (dbName) {
            Kuzzle.connect().then(() => Kuzzle.realtime.subscribe(dbName, dbClassVersion(dbClass), filters || {},
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
        }
    }, [queryClient])
}