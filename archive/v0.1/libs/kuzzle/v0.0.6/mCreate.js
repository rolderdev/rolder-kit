import { convertOne } from './convert'
import ErrorHandler from '../../error-handler/v0.0.1/ErrorHandler'
import { classVersion, dbVersion } from '../../../utils/data/v.0.1.0/data'
import useData from '../../use-data/v0.1.0/use-data'

const mCreate = async ({ className, items }) => {
    const { debug, classes } = Rolder

    const index = dbVersion()
    const classNameV = classVersion(className)

    if (debug > 0) console.time(classNameV + ' mCreate time')
    if (debug > 1) console.log(classNameV + ' props:', { className, body })

    return Kuzzle.connect().then(() =>
        Kuzzle.document.mCreate(index, classNameV, items, { refresh: 'wait_for' })
            .then((response) => {
                if (!classes[className].subscribe) useData.invalidate({ className })
                const jsonItems = response.successes.map(k => convertOne(k))

                if (response.errors.length > 0) ErrorHandler({
                    title: 'Системная ошибка!',
                    message: 'Kuzzle mCreate errors at class ' + classNameV + ': ' + JSON.stringify(response.errors)
                })
                if (debug > 1) console.log(classNameV + ' mCreated:', jsonItems)
                if (debug > 0) console.timeEnd(classNameV + ' mCreate time')
                return jsonItems
            })
            .catch((error) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle mCreate ' + classNameV + ': ' + error.message }))
    )
}

export default mCreate