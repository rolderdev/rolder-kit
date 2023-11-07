import useData from '../../../libs/useData/v0.1.1/useData'
import { dbClassVersion, dbVersion } from '../../../utils/data/v.0.1.1/data'

export default function node() {
    const { dbClasses, debug } = Rolder

    if (dbClasses) {
        let subscribedDbClasses = []
        Object.keys(dbClasses).forEach(dbClass => {
            if (dbClasses[dbClass].subscribe) {
                const index = dbVersion()
                const dbClassV = dbClassVersion(dbClass)

                Kuzzle.realtime.subscribe(index, dbClassV, {},
                    notif => {
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