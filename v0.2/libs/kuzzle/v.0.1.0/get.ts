import { convertKuzzleRespone, dbClassVersion } from '../../../utils/data/v.0.1.0/data'
import ErrorHandler from '../../errorHandler/v0.1.0/ErrorHandler'

const Rolder = window.Rolder
const Kuzzle = window.Kuzzle

const get = async ({ queryKey: [{ dbVersion, className, id }] }) => {
    const { debug } = Rolder
    const classNameV = dbClassVersion(className)

    if (debug > 0) console.time(classNameV + ' get time')

    await Kuzzle.connect()
    return Kuzzle.document.get(dbVersion, classNameV, id)
        .then((response) => {
            const data = {
                [className]: [convertKuzzleRespone(response)]
            }

            if (debug > 0) console.timeEnd(classNameV + ' get time')

            return data
        }).catch((error) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle get ' + classNameV + ': ' + error.message }))
}

export default get