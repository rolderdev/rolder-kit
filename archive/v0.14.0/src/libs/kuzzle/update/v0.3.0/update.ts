import { convertKuzzleResponse, dbVersion, dbClassVersion } from '../../../../utils/data/v0.3.0/data'
import conLog from '../../../../utils/debug/conLog/v0.1.0/conLog'
import ErrorHandler from '../../../errorHandler/v0.1.0/ErrorHandler'
import useData from '../../../useData/v0.5.0/useData'
import getOptions from '../../utils/getOptions/v0.1.0/getOptions'

const update = async (dbClass: string, id: string, body: any, options?: Options) => {
    const { Kuzzle, Noodl } = window
    const opts = getOptions(dbClass, options)
    const dbClassV = dbClassVersion(dbClass)

    conLog(`${dbClassV} update`, 'time')
    conLog([`${dbClassV} props: `, { dbClass, id, body, options }])

    return Kuzzle.connect().then(() =>
        Kuzzle.document.update(dbVersion(), dbClassV, id, body, opts)
            .then((response: any) => {
                if (!Noodl.Objects[dbClass].subscribe) useData.invalidate(dbClass)
                const jsonItem = convertKuzzleResponse(response)
                conLog([`${dbClassV} updated: `, jsonItem])
                conLog(`${dbClassV} update`, 'timeEnd')
                return jsonItem
            })
            .catch((error: any) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle update ' + dbClassV + ': ' + error.message }))
    )
}

export default update