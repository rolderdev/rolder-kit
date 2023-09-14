import conLog from "../../../../../../utils/debug/conLog/v0.1.0/conLog"
import ErrorHandler from "../../../../../errorHandler/v0.1.0/ErrorHandler"
import { setOptions } from "../../../../0_query/tools/setDefaults/v0.2.0/setDefaults"
import deepFlush from "../../../../1_transform/tools/deepFlush/v0.1.0/deepFlush"
import updateNItems from "../../../../1_transform/update/v0.1.0/updateNItems"
import { dbClassVersion, dbVersion } from "../../../tools/getVersion/v0.2.0/getVersion"

const mUpdate = async (updateItems: CreateUpdateItems, optimistic: boolean): Promise<NItem[]> => {
    const { Kuzzle } = window
    const { dbClass, items } = updateItems
    const options = setOptions(dbClass)

    const dbClassV = dbClassVersion(dbClass)
    const flushedItems = items.map((i: any) => {
        i._id = i.id
        return deepFlush(i)
    })

    let nItems: NItem[] = []
    if (optimistic) nItems = updateNItems(dbClass, flushedItems.map(i => ({ id: i.id, ...i.body })))
    
    conLog(`${dbClassV} mUpdate`, 'time')
    conLog([`${dbClassV} props: `, { dbClass, flushedItems, options }])

    return Kuzzle.connect().then(() =>
        Kuzzle.document.mUpdate(dbVersion(), dbClassV, flushedItems, { ...options, retryOnConflict: 3 })
            .then((response: any) => {
                if (!optimistic) nItems = updateNItems(dbClass, flushedItems.map(i => ({ id: i.id, ...i.body })))

                if (response.errors.length > 0) ErrorHandler({
                    title: 'Системная ошибка!',
                    message: 'Kuzzle mUpdate errors at dbClass ' + dbClassV + ': ' + JSON.stringify(response.errors)
                })

                conLog([`${dbClassV} mUpdated: `, nItems])
                conLog(`${dbClassV} mUpdate`, 'timeEnd')

                return nItems
            })
            .catch((error: any) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle mUpdate ' + dbClassV + ': ' + error.message }))
    )
}

export default mUpdate