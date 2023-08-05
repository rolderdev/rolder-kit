import { convertMany } from './convert'
import { classVersion } from '../../../utils/data/v.0.1.0/data'
import ErrorHandler from '../../error-handler/v0.0.1/ErrorHandler'

const search = async ({ queryKey: [{ dbVersion, className: classNames, query, options }] }) => {
    const { debug } = Rolder
    const classNamesV = classNames.map(c => classVersion(c))

    if (debug > 0) console.time(classNamesV.join(', ') + ' search time')

    return Kuzzle.connect().then(() =>
        Kuzzle.query(
            {
                controller: 'document',
                action: 'search',
                targets: [{ index: dbVersion, collections: classNamesV }],
                body: { query },
                ...options
            })
            .then((response) => {
                const data = convertMany(response.result)

                if (debug > 0) console.timeEnd(classNamesV.join(', ') + ' search time')

                return data
            }).catch((error) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle search ' + classNamesV.join(', ') + ': ' + error.message }))
    )
}

export default search