import { convertKuzzleResponse, dbVersion, dbClassVersion } from '../../../../utils/data/v0.3.0/data'
import conLog from '../../../../utils/debug/conLog/v0.1.0/conLog'
import ErrorHandler from '../../../errorHandler/v0.1.0/ErrorHandler'
import useData from '../../../useData/v0.5.0/useData'
import getOptions from '../../utils/getOptions/v0.1.0/getOptions'

const create = async (dbClass: string, body: any, options?: Options) => {
    const { Kuzzle, Noodl } = window
    const opts = getOptions(dbClass, options)
    const dbClassV = dbClassVersion(dbClass)

    conLog(`${dbClassV} create`, 'time')
    conLog([`${dbClassV} props: `, { dbClass, body, options }])

    return Kuzzle.connect().then(() =>
        Kuzzle.document.create(dbVersion(), dbClassV, body, null, opts)
            .then((response: any) => {
                if (!Noodl.Objects[dbClass].subscribe) useData.invalidate(dbClass)
                const jsonItem = convertKuzzleResponse(response)
                conLog([`${dbClassV} created: `, jsonItem])
                conLog(`${dbClassV} create`, 'timeEnd')
                return jsonItem
            })
            .catch((error: any) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle create ' + dbClassV + ': ' + error.message }))
    )
}

export default create