import { convertKuzzleResponse, dbVersion, dbClassVersion } from '../../../utils/data/v0.3.0/data'
import ErrorHandler from '../../errorHandler/v0.1.0/ErrorHandler'
import useData from '../../useData/v0.2.0/useData'

const mUpdate = async ({ dbClass, items }: { dbClass: string, items: any }) => {
    const Kuzzle = window.Kuzzle
    const { debug, dbClasses } = window.Rolder

    const index = dbVersion()
    const dbClassV = dbClassVersion(dbClass)

    if (debug > 0) console.time(dbClassV + ' mUpdate time')
    if (debug > 1) console.log(dbClassV + ' props:', { dbClass, items })

    items.forEach((i: any) => {
        i._id = i.id
        delete i.id
    })

    return Kuzzle.connect().then(() =>
        Kuzzle.document.mUpdate(index, dbClassV, items, { refresh: 'wait_for', retryOnConflict: 3 })
            .then((response: any) => {
                if (!dbClasses[dbClass].subscribe) useData.invalidate({ dbClass })
                const jsonItems = response.successes.map((k: any) => convertKuzzleResponse(k))

                if (response.errors.length > 0) ErrorHandler({
                    title: 'Системная ошибка!',
                    message: 'Kuzzle mUpdate errors at class ' + dbClassV + ': ' + JSON.stringify(response.errors)
                })
                if (debug > 1) console.log(dbClassV + ' mUpdated:', jsonItems)
                if (debug > 0) console.timeEnd(dbClassV + ' mUpdate time')
                return jsonItems
            })
            .catch((error: any) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle mUpdate ' + dbClassV + ': ' + error.message }))
    )
}

export default mUpdate