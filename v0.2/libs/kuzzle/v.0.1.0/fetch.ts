import { convertKuzzleRespone, dbClassVersion } from '../../../utils/data/v.0.1.0/data'
import ErrorHandler from '../../errorHandler/v0.1.0/ErrorHandler'

const Rolder = window.Rolder
const Kuzzle = window.Kuzzle

const fetch = async ({ queryKey: [{ dbVersion, className, query, sort, options }] }) => {
    const { debug } = Rolder
    const classNameV = dbClassVersion(className)

    if (debug > 0) console.time(classNameV + ' fetch time')

    await Kuzzle.connect()
    return Kuzzle.document.search(dbVersion, classNameV, { query, sort }, { ...options })
        .then((response) => {
            const data = {
                [className]: response.hits.map(k => convertKuzzleRespone(k)),
                fetchedCount: response.fetched,
                totalCount: response.total
            }

            if (debug > 0) console.timeEnd(classNameV + ' fetch time')

            return data
        }).catch((error) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle fetch ' + classNameV + ': ' + error.message }))
}

export default fetch