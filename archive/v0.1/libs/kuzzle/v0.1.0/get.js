import { convertKuzzleResponse } from '../../../utils/data/v.0.1.1/data'
import { dbClassVersion } from '../../../utils/data/v.0.1.1/data'
import ErrorHandler from '../../error-handler/v0.0.1/ErrorHandler'

const get = async ({ queryKey: [{ dbVersion, dbClass, id }] }) => {
    const { debug } = Rolder
    const dbClassV = dbClassVersion(dbClass)

    if (debug > 0) console.time(dbClassV + ' get time')

    return Kuzzle.connect().then(() =>
        Kuzzle.document.get(dbVersion, dbClassV, id)
            .then((response) => {
                const data = {
                    [dbClass]: [convertKuzzleResponse(response)]
                }

                if (debug > 0) console.timeEnd(dbClassV + ' get time')

                return data
            }).catch((error) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle get ' + dbClassV + ': ' + error.message }))
    )
}

export default get