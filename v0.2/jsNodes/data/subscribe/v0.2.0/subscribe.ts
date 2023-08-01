import useData from '../../../../libs/useData/v0.2.0/useData'
import { dbClassVersion, dbVersion } from '../../../../utils/data/v0.2.0/data'

export default function node() {
    const { dbClasses, debug } = window.Rolder

    if (dbClasses) {
        let subscribedDbClasses: string[] = []
        Object.keys(dbClasses).forEach(dbClass => {
            if (dbClasses[dbClass].subscribe) {
                const index = dbVersion()
                const dbClassV = dbClassVersion(dbClass)

                window.Kuzzle.realtime.subscribe(index, dbClassV, {},
                    (notif: { type: string; result: any }) => {
                        if (notif.type !== 'document') return
                        if (debug > 1) console.log('new ' + dbClassV + ' recieved:', notif.result)
                        useData.invalidate({ dbClass })
                    }
                )
                subscribedDbClasses.push(dbClassV)
            }
        })
        if (debug > 1) console.log('Subscribed to: ', subscribedDbClasses)
    }
}