import { convertKuzzleResponse } from '../../../utils/data/v.0.1.1/data'
import { dbClassVersion } from '../../../utils/data/v.0.1.1/data'
import ErrorHandler from '../../error-handler/v0.0.1/ErrorHandler'

const fetch = async ({ queryKey: [{ dbVersion, dbClass, query, sort, options }] }) => {
    const { debug } = Rolder
    const dbClassV = dbClassVersion(dbClass)

    if (debug > 0) console.time(dbClassV + ' fetch time')

    return Kuzzle.connect().then(() =>
        Kuzzle.document.search(dbVersion, dbClassV, { query, sort }, { ...options })
            .then((response) => {
                const data = {
                    [dbClass]: response.hits.map(k => convertKuzzleResponse(k)),
                    fetchedCount: response.fetched,
                    totalCount: response.total
                }

                if (debug > 0) console.timeEnd(dbClassV + ' fetch time')

                return data
            }).catch((error) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle fetch ' + dbClassV + ': ' + error.message }))
    )
}

export default fetch