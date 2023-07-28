import { convertKuzzleResponses } from '../../../utils/data/v.0.1.1/data'
import { dbClassVersion } from '../../../utils/data/v.0.1.1/data'
import ErrorHandler from '../../error-handler/v0.0.1/ErrorHandler'

const search = async ({ queryKey: [{ dbVersion, dbClass: dbClasses, query, options }] }) => {
    const { debug } = Rolder
    const dbClassesV = dbClasses.map(c => dbClassVersion(c))

    if (debug > 0) console.time(dbClassesV.join(', ') + ' search time')

    return Kuzzle.connect().then(() =>
        Kuzzle.query(
            {
                controller: 'document',
                action: 'search',
                targets: [{ index: dbVersion, collections: dbClassesV }],
                body: { query },
                ...options
            })
            .then((response) => {
                const data = convertKuzzleResponses(response.result)

                if (debug > 0) console.timeEnd(dbClassesV.join(', ') + ' search time')

                return data
            }).catch((error) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle search ' + dbClassesV.join(', ') + ': ' + error.message }))
    )
}

export default search