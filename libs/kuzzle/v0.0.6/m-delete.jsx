import ErrorHandler from '../../error-handler/v0.0.1/ErrorHandler'
import { classVersion, dbVersion } from '../../../utils/data/v.0.1.0/data'
import useData from '../../use-data/v0.1.0/use-data'

const mDelete = async ({ className, ids }) => {
    const { debug, classes } = Rolder
    const index = dbVersion()
    const classNameV = classVersion(className)

    if (debug > 0) console.time(classNameV + ' mDelete time')
    if (debug > 1) console.log(classNameV + ' props:', { className, ids })

    await Kuzzle.connect()
    return Kuzzle.document.mDelete(index, classNameV, ids, { refresh: 'wait_for' })
        .then((response) => {
            if (!classes[className].subscribe) useData.invalidate({ className })

            if (debug > 1) console.log(classNameV + ' mDelete:', response)
            if (debug > 0) console.timeEnd(classNameV + ' mDelete time')
            return
        })
        .catch((error) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle mDelete ' + classNameV + ': ' + error.message }))
}

export default mDelete