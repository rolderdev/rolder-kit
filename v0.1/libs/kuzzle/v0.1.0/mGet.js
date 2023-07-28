import { convertKuzzleResponse } from '../../../utils/data/v.0.1.1/data'
import { dbClassVersion } from '../../../utils/data/v.0.1.1/data'
import ErrorHandler from '../../error-handler/v0.0.1/ErrorHandler'

const mGet = async ({ queryKey: [{ dbVersion, dbClass, ids }] }) => {
    const { debug } = Rolder
    const dbClassV = dbClassVersion(dbClass)

    if (debug > 0) console.time(dbClassV + ' mGet time')

    return Kuzzle.connect().then(() =>
        Kuzzle.document.mGet(dbVersion, dbClassV, ids)
            .then((response) => {
                const data = {
                    [dbClass]: response.successes.map(k => convertKuzzleResponse(k)),
                    fetchedCount: response.successes.length
                }
                if (response.errors.length > 0) ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle mGet, no docs with this ids for ' + dbClassV + ': ' + response.errors })

                if (debug > 0) console.timeEnd(dbClassV + ' mGet time')

                return data
            }).catch((error) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle mGet ' + dbClassV + ': ' + error.message }))
    )
}

export default mGet