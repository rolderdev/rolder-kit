import { Notification } from "kuzzle-sdk"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { dbClassVersion } from "../../../../../utils/getVersion/v0.5.0/getVersion"
import { log } from "../../../../../../../utils/debug/log/v0.2.0/log"
import { deepMap } from "nanostores"

const subStates = deepMap<{ [noodlNodeId: string]: boolean }>({})
const rooms = deepMap<{ [noodlNodeId: string]: string }>({})
const subFilters = deepMap<{ [noodlNodeId: string]: Filters }>({})

export async function subscribe(dataScheme: DataScheme123, noodlNodeId: string) {
    const { isEmpty, clone } = window.R.libs.just
    const { deepEqual } = window.R.libs
    const { dbClass, filters } = dataScheme
    const queryClient = useQueryClient()

    let fs = clone(filters || {})
    if (!isEmpty(fs)) {
        if (fs.multi_match) delete fs.multi_match
        if (fs.and?.length) fs.and = fs.and.filter((i: any) => !i.multi_match)
    }

    const subFilter = subFilters.get()[noodlNodeId]
    if (!subFilter) subFilters.setKey(noodlNodeId, fs)
    const isChanged = !deepEqual(fs, subFilter)
    if (isChanged) subFilters.setKey(noodlNodeId, fs)
    //console.log(noodlNodeId, dbClass, rooms.get())    
    useEffect(() => {
        const subState = subStates.get()[noodlNodeId]
        //if (!subState) 
        sub(dbClass, dataScheme, fs, noodlNodeId, queryClient)
        //if (isChanged) 
        //unsub(dbClass, noodlNodeId).then(() => sub(dbClass, dataScheme, fs, noodlNodeId, queryClient))
    }, [])

    useEffect(() => { return () => { unsub(dbClass, noodlNodeId) } }, [])
}

async function sub(dbClass: string, dataScheme: DataScheme123, filters: Filters, noodlNodeId: string, queryClient: any) {
    const { Kuzzle } = window.R.libs
    const { dbName } = window.R.env

    await Kuzzle.connect()
    if (dbName) Kuzzle.realtime.subscribe(dbName, dbClassVersion(dbClass), filters,
        (notif: Notification) => {
            if (notif.type !== 'document') return
            queryClient.invalidateQueries({ queryKey: [dataScheme] })
            log(`Subscribe - ${notif.action} ${dbClass}: `, notif.result)
        }).then(newRoomId => {
            rooms.setKey(noodlNodeId, newRoomId)
            subStates.setKey(noodlNodeId, true)
            log(`Subscribed to ${dbClass} ${noodlNodeId}`)
        }).catch((error) => console.log(`Subscribe error`, error))
}

async function unsub(dbClass: string, noodlNodeId: string) {
    const { Kuzzle } = window.R.libs
    const { dbName } = window.R.env
    const roomId = rooms.get()[noodlNodeId]

    await Kuzzle.connect()
    if (dbName && roomId) Kuzzle.realtime.count(roomId)
        .then(count => {
            if (count) Kuzzle.realtime.unsubscribe(roomId).then(() => {
                rooms.setKey(noodlNodeId, '')
                subStates.setKey(noodlNodeId, false)
                log(`Unsubscribed from ${dbClass} ${noodlNodeId}`)
            }).catch((error) => console.log(`Unsubscribe error`, error))
            else rooms.setKey(noodlNodeId, '')
        }).catch((error) => console.log(`Subscribes count`, error))
}