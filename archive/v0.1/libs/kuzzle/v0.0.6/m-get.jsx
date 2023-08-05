import { convertOne } from './convert'
import { classVersion } from '../../../utils/data/v.0.1.0/data'
import ErrorHandler from '../../error-handler/v0.0.1/ErrorHandler'

const mGet = async ({ queryKey: [{ dbVersion, className, ids }] }) => {
    const { debug } = Rolder
    const classNameV = classVersion(className)

    if (debug > 0) console.time(classNameV + ' mGet time')

    return Kuzzle.connect().then(() =>
        Kuzzle.document.mGet(dbVersion, classNameV, ids)
            .then((response) => {
                const data = {
                    [className]: response.successes.map(k => convertOne(k)),
                    fetchedCount: response.successes.length
                }
                if (response.errors.length > 0) ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle mGet, no docs with this ids for ' + classNameV + ': ' + response.errors })

                if (debug > 0) console.timeEnd(classNameV + ' mGet time')

                return data
            }).catch((error) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle mGet ' + classNameV + ': ' + error.message }))
    )
}

export default mGet