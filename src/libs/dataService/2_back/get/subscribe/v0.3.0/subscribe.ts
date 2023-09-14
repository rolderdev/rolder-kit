import { Notification } from "kuzzle-sdk";
import { dbClassVersion, dbVersion } from "../../../tools/getVersion/v0.2.0/getVersion";
import updateNItems from "../../../../1_transform/update/v0.1.0/updateNItems";
import convertK from "../../../../1_transform/tools/convertK/v0.1.0/convertK";
import conLog from "../../../../../../utils/debug/conLog/v0.1.0/conLog";
import triggerQueries from "../../../../1_transform/tools/triggerQueries/v0.1.0/triggerQueries";
import addNItem from "../../../../1_transform/create/v0.1.0/addNItem";
import removeNItem from "../../../../1_transform/create/v0.1.0/removeNItem";

export default async function ({ dbClass, filters, sorts }: GetQuery) {
    const { Kuzzle, Noodl } = window
    const dbClassV = dbClassVersion(dbClass)

    await Kuzzle.connect()
    const connectionsCount = await Kuzzle.realtime.count(Noodl.Variables.roomId || '');
    if (connectionsCount === 0) {
        Noodl.Variables.roomId = await Kuzzle.realtime.subscribe(dbVersion(), dbClassV, filters,
            (notif: Notification) => {
                if (notif.type !== 'document') return

                const rItem = convertK([notif.result] as KItem[])?.[0]
                switch (notif.action) {
                    case 'update': updateNItems(dbClass, [rItem])?.[0]; break
                    case 'create': addNItem(dbClass, rItem, sorts); break
                    case 'delete': removeNItem(dbClass, rItem); break
                }
                triggerQueries(dbClass)

                conLog([`Subscribe - ${notif.action} ${dbClass}: `, notif.result])
            }
        )
        conLog([`Subscribed to ${dbClass}`])
    }
}