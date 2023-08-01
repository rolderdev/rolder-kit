import { convertKuzzleResponse, dbClassVersion } from '../../../utils/data/v0.2.0/data'
import ErrorHandler from '../../errorHandler/v0.1.0/ErrorHandler'

async function fetch({ queryKey: [{ dbVersion, dbClass, query, sort, options }] }: { queryKey: any }) {
    const Kuzzle = window.Kuzzle
    const { debug } = window.Rolder
    const dbClassV = dbClassVersion(dbClass)

    if (debug > 0) console.time(dbClassV + ' fetch time')

    return Kuzzle.connect().then(() =>
        Kuzzle.document.search(dbVersion, dbClassV, { query, sort }, { ...options })
            .then((response: { hits: any[]; fetched: any; total: any }) => {
                const data = {
                    [dbClass]: response.hits.map((k: { _source: any; _id: any }) => convertKuzzleResponse(k)),
                    fetchedCount: response.fetched,
                    totalCount: response.total
                }
                if (debug > 0) console.timeEnd(dbClassV + ' fetch time')
                return data
            }).catch((error: { message: string }) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle fetch ' + dbClassV + ': ' + error.message }))
    )
}

export default fetch