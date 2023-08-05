import { convertOne } from './convert'
import ErrorHandler from '../../error-handler/v0.0.1/ErrorHandler'
import { classVersion, dbVersion } from '../../../utils/data/v.0.1.0/data'
import useData from '../../use-data/v0.1.0/use-data'

const create = async ({ className, body }) => {
    const { debug, classes } = Rolder

    const index = dbVersion()
    const classNameV = classVersion(className)

    if (debug > 0) console.time(classNameV + ' create time')
    if (debug > 1) console.log(classNameV + ' props:', { className, body })

    return Kuzzle.connect().then(() =>
        Kuzzle.document.create(index, classNameV, body, null, { refresh: 'wait_for' })
            .then((response) => {
                if (!classes[className].subscribe) useData.invalidate({ className })
                const jsonItem = convertOne(response)
                if (debug > 1) console.log(classNameV + ' created:', jsonItem)
                if (debug > 0) console.timeEnd(classNameV + ' create time')
                return jsonItem
            })
            .catch((error) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle create ' + classNameV + ': ' + error.message }))
    )
}

export default create