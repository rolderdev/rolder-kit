import { convertKuzzleRespone, dbClassVersion } from '../../../utils/data/v.0.1.0/data'
import ErrorHandler from '../../errorHandler/v0.1.0/ErrorHandler'

const Rolder = window.Rolder
const Kuzzle = window.Kuzzle

const mGet = async ({ queryKey: [{ dbVersion, className, ids }] }) => {
    const { debug } = Rolder
    const classNameV = dbClassVersion(className)

    if (debug > 0) console.time(classNameV + ' mGet time')

    await Kuzzle.connect()
    return Kuzzle.document.mGet(dbVersion, classNameV, ids)
        .then((response) => {
            const data = {
                [className]: response.successes.map(k => convertKuzzleRespone(k)),
                fetchedCount: response.successes.length
            }
            if (response.errors.length > 0) ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle mGet, no docs with this ids for ' + classNameV + ': ' + response.errors })

            if (debug > 0) console.timeEnd(classNameV + ' mGet time')

            return data
        }).catch((error) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle mGet ' + classNameV + ': ' + error.message }))
}

export default mGet