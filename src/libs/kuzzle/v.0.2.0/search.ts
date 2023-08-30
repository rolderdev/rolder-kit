import { convertKuzzleResponses, dbClassVersion } from '../../../utils/data/v0.2.0/data'
import ErrorHandler from '../../errorHandler/v0.1.0/ErrorHandler'

const search = async ({ queryKey: [{ dbVersion, dbClass: dbClasses, query, options }] }: { queryKey: any }) => {
    const { debug } = window.Rolder
    const Kuzzle = window.Kuzzle
    const dbClassV = dbClasses.map((c: string | number) => dbClassVersion(c))

    if (debug > 0) console.time(dbClassV.join(', ') + ' search time')

    return Kuzzle.connect().then(() =>
        Kuzzle.query(
            {
                controller: 'document',
                action: 'search',
                targets: [{ index: dbVersion, collections: dbClassV }],
                body: { query },
                ...options
            })
            .then((response: { result: { hits: any[]; total: any } }) => {
                const data = convertKuzzleResponses(response.result)

                if (debug > 0) console.timeEnd(dbClassV.join(', ') + ' search time')

                return data
            }).catch((error: { message: string }) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle search ' + dbClassV.join(', ') + ': ' + error.message }))
    )
}

export default search