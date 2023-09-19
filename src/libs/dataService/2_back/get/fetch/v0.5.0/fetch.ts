import conLog from "../../../../../../utils/debug/conLog/v0.1.0/conLog"
import ErrorHandler from "../../../../../errorHandler/v0.1.0/ErrorHandler"
import createNDBClass from "../../../../1_transform/create/v0.1.0/createNDBClass"
import { dbClassVersion, dbVersion } from "../../../tools/getVersion/v0.2.0/getVersion"

export default async function (useQueryProps: any): Promise<NDBClass> {
    const { Kuzzle } = window
    const { dbClass, filters, sorts, options, subscribe } = useQueryProps.queryKey[0]
    const dbClassV = dbClassVersion(dbClass)

    conLog(`${dbClassV} fetch`, 'time')

    return Kuzzle.connect().then(() =>
        Kuzzle.document.search(dbVersion(), dbClassV, { query: filters, sort: sorts }, { ...options })
            .then((k: KResponse) => {
                conLog(`${dbClassV} fetch`, 'timeEnd')
                return { ...createNDBClass(dbClass, k, subscribe), version: 1 }
            }).catch((error: { message: string }) =>
                ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle fetch ' + dbClassV + ': ' + error.message }))
    )
}