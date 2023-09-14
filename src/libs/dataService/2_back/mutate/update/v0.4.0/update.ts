import conLog from '../../../../../../utils/debug/conLog/v0.1.0/conLog'
import ErrorHandler from '../../../../../errorHandler/v0.1.0/ErrorHandler'
import { setOptions } from '../../../../0_query/tools/setDefaults/v0.2.0/setDefaults'
import { dbClassVersion, dbVersion } from '../../../tools/getVersion/v0.2.0/getVersion'
import deepFlush from '../../../../1_transform/tools/deepFlush/v0.1.0/deepFlush'
import updateNItems from '../../../../1_transform/update/v0.1.0/updateNItems'

const update = async (updateItem: CreateUpdateItem, optimistic: boolean): Promise<NItem> => {
    const { Kuzzle } = window
    const { dbClass, id, body } = updateItem
    const options = setOptions(dbClass)
    const dbClassV = dbClassVersion(dbClass)
    const flushedBody = deepFlush(body)

    conLog(`${dbClassV} update`, 'time')
    conLog([`${dbClassV} props: `, { dbClass, id, flushedBody, options }])

    let nItem: NItem
    if (optimistic) nItem = updateNItems(dbClass, [{ id, ...flushedBody }])?.[0]
    
    return Kuzzle.connect().then(() =>
        Kuzzle.document.update(dbVersion(), dbClassV, id, flushedBody, options)
            .then(() => {
                conLog([`${dbClassV} updated: `, nItem])
                conLog(`${dbClassV} update`, 'timeEnd')

                if (!optimistic) nItem = updateNItems(dbClass, [{ id, ...flushedBody }])?.[0]
                return nItem
            })
            .catch((error: any) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle update ' + dbClassV + ': ' + error.message }))
    )
}

export default update