import conLog from "../../../../../../utils/debug/conLog/v0.1.0/conLog"
import ErrorHandler from "../../../../../errorHandler/v0.1.0/ErrorHandler"
import { dbClassVersion, dbVersion } from "../../../tools/getVersion/v0.2.0/getVersion"

export default async function (useQueryProps: any): Promise<NItem> {
    const { Kuzzle } = window
    const { dbClass, itemId } = useQueryProps.queryKey[0]
    const dbClassV = dbClassVersion(dbClass)
    conLog(`${dbClassV} get`, 'time')

    return Kuzzle.connect().then(() =>
        Kuzzle.document.get(dbVersion(), dbClassV, itemId)
            .then((r: KResponse) => {
                console.log('get response', r)
                //const data = 

                conLog(`${dbClassV} get`, 'timeEnd')

                //return data
            }).catch((error: { message: string }) =>
                ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle get ' + dbClassV + ': ' + error.message }))
    )
}