import useData from '../../../libs/useData/v0.2.0/useData'
import { dbClassVersion, dbVersion } from '../../../utils/data/v.0.1.0/data'

const Rolder = window.Rolder
const Kuzzle = window.Kuzzle

export default function node() {
    const { dbClasses, debug } = Rolder

    if (dbClasses) {
        let subscribedClasses: string[] = []
        Object.keys(dbClasses).forEach(dbClass => {
            if (dbClasses[dbClass].subscribe) {
                const index = dbVersion()
                const dbClassV = dbClassVersion(dbClass)

                Kuzzle.realtime.subscribe(index, dbClassV, {},
                    (notif: { type: string; result: any }) => {
                        if (notif.type !== 'document') return
                        if (debug > 1) console.log('new ' + dbClassV + ' recieved:', notif.result)
                        useData.invalidate({ dbClass })
                    }
                )
                subscribedClasses.push(dbClassV)
            }
        })
        if (debug > 1) console.log('Subscribed to: ', subscribedClasses)
    }
}