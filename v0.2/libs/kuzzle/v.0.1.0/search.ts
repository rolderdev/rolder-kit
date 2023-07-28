import { convertKuzzleRespones, dbClassVersion } from '../../../utils/data/v.0.1.0/data'
import ErrorHandler from '../../errorHandler/v0.1.0/ErrorHandler'

const Rolder = window.Rolder
const Kuzzle = window.Kuzzle

const search = async ({ queryKey: [{ dbVersion, dbClass: dbClasses, query, options }] }) => {
    const { debug } = Rolder
    const dbClassV = dbClasses.map(c => dbClassVersion(c))

    if (debug > 0) console.time(dbClassV.join(', ') + ' search time')

    await Kuzzle.connect()
    return Kuzzle.query(
        {
            controller: 'document',
            action: 'search',
            targets: [{ index: dbVersion, collections: dbClassV }],
            body: { query },
            ...options
        })
        .then((response) => {
            const data = convertKuzzleRespones(response.result)

            if (debug > 0) console.timeEnd(dbClassV.join(', ') + ' search time')

            return data
        }).catch((error) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle search ' + dbClassV.join(', ') + ': ' + error.message }))
}

export default search