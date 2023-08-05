import { convertKuzzleResponse, dbVersion, dbClassVersion } from '../../../utils/data/v0.2.0/data'
import ErrorHandler from '../../errorHandler/v0.1.0/ErrorHandler'
import useData from '../../useData/v0.2.0/useData'

const mCreate = async ({ dbClass, items }: { dbClass: string, items: any }) => {
    const Kuzzle = window.Kuzzle
    const { debug, dbClasses } = window.Rolder

    const index = dbVersion()
    const dbClassV = dbClassVersion(dbClass)

    if (debug > 0) console.time(dbClassV + ' mCreate time')
    if (debug > 1) console.log(dbClassV + ' props:', { dbClass, items })

    return Kuzzle.connect().then(() =>
        Kuzzle.document.mCreate(index, dbClassV, items, { refresh: 'wait_for' })
            .then((response: any) => {
                if (!dbClasses[dbClass].subscribe) useData.invalidate({ dbClass })
                const jsonItems = response.successes.map((k: any) => convertKuzzleResponse(k))

                if (response.errors.length > 0) ErrorHandler({
                    title: 'Системная ошибка!',
                    message: 'Kuzzle mCreate errors at class ' + dbClassV + ': ' + JSON.stringify(response.errors)
                })
                if (debug > 1) console.log(dbClassV + ' mCreated:', jsonItems)
                if (debug > 0) console.timeEnd(dbClassV + ' mCreate time')
                return jsonItems
            })
            .catch((error: any) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle mCreate ' + dbClassV + ': ' + error.message }))
    )
}

export default mCreate