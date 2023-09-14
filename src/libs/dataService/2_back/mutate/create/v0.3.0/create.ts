import conLog from "../../../../../../utils/debug/conLog/v0.1.0/conLog"
import ErrorHandler from "../../../../../errorHandler/v0.1.0/ErrorHandler"
import { setOptions } from "../../../../0_query/tools/setDefaults/v0.2.0/setDefaults"
import addNItem from "../../../../1_transform/create/v0.1.0/addNItem"
import convertK from "../../../../1_transform/tools/convertK/v0.1.0/convertK"
import deepFlush from "../../../../1_transform/tools/deepFlush/v0.1.0/deepFlush"
import triggerQueries from "../../../../1_transform/tools/triggerQueries/v0.1.0/triggerQueries"
import { dbClassVersion, dbVersion } from "../../../tools/getVersion/v0.2.0/getVersion"

const create = async (createItem: CreateUpdateItem): Promise<NItem> => {
    const { Kuzzle } = window
    const { dbClass, body } = createItem
    const options = setOptions(dbClass)
    const dbClassV = dbClassVersion(dbClass)
    const flushedBody = deepFlush(body)

    conLog(`${dbClassV} create`, 'time')
    conLog([`${dbClassV} props: `, { dbClass, body, options }])

    return Kuzzle.connect().then(() =>
        Kuzzle.document.create(dbVersion(), dbClassV, flushedBody, null, options)
            .then((kItem: KItem) => {
                const rItem = convertK([kItem])?.[0]
                const nItem = addNItem(dbClass, rItem)
                triggerQueries(dbClass)

                conLog([`${dbClassV} created: `, nItem])
                conLog(`${dbClassV} create`, 'timeEnd')
                return nItem
            })
            .catch((error: any) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle create ' + dbClassV + ': ' + error.message }))
    )
}

export default create