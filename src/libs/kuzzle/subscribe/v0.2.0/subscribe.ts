import { dbVersion, dbClassVersion, convertKuzzleResponse } from '../../../../utils/data/v0.3.0/data'
import conLog from '../../../../utils/debug/conLog/v0.1.0/conLog'
import updateNoodlClass from '../../utils/updateNoodlClass/v0.1.0/updateNoodlClass'

async function subscribe({ dbClass, filters, sorts }: KuzzleSubscribe) {
    const { Kuzzle, Noodl } = window
    const dbClassV = dbClassVersion(dbClass)

    await Kuzzle.connect()
    const connectionsCount = await Kuzzle.realtime.count(Noodl.Variables.roomId || '');
    if (connectionsCount === 0) {
        Noodl.Variables.roomId = await Kuzzle.realtime.subscribe(dbVersion(), dbClassV, filters,
            (notif: { type: string; action: string, result: any }) => {
                if (notif.type !== 'document') return
                updateNoodlClass({ dbClass, action: notif.action, item: convertKuzzleResponse(notif.result), sorts })
                conLog([`New ${dbClass} recieved: `, notif.result])
            }
        )
        Noodl.Objects[dbClass].subscribe = true
        conLog([`Subscribed to ${dbClass}`])
    }
}

export default subscribe