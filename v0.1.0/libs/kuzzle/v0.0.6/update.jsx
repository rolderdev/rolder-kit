import { convertOne } from './convert'
import ErrorHandler from '../../error-handler/v0.0.1/ErrorHandler'
import { classVersion, dbVersion } from '../../../utils/data/v.0.1.0/data'
import useData from '../../use-data/v0.1.0/use-data'

const update = async ({ className, id, body }) => {
    const { debug, classes } = Rolder
    const index = dbVersion()
    const classNameV = classVersion(className)

    if (debug > 0) console.time(classNameV + ' update time')
    if (debug > 1) console.log(classNameV + ' props:', { className, id, body })

    await Kuzzle.connect()
    return Kuzzle.document.update(index, classNameV, id, body, { refresh: 'wait_for' })
        .then((response) => {
            if (!classes[className].subscribe) useData.invalidate({ className })
            const jsonItem = convertOne(response)
            if (debug > 1) console.log(classNameV + ' updated:', jsonItem)
            if (debug > 0) console.timeEnd(classNameV + ' update time')
            return jsonItem
        })
        .catch((error) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle update ' + classNameV + ': ' + error.message }))
}

export default update