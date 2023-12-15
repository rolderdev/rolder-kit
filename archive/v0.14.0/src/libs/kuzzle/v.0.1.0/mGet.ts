import { convertKuzzleResponse, dbClassVersion } from '../../../utils/data/v0.2.0/data'
import ErrorHandler from '../../errorHandler/v0.1.0/ErrorHandler'

async function mGet({ queryKey: [{ dbVersion, dbClass, itemsIds }] }: { queryKey: any }) {
    const { debug } = window.Rolder
    const Kuzzle = window.Kuzzle
    const dbClassV = dbClassVersion(dbClass)

    if (debug > 0) console.time(dbClassV + ' mGet time')

    return Kuzzle.connect().then(() =>
        Kuzzle.document.mGet(dbVersion, dbClassV, itemsIds)
            .then((response: { successes: any[]; errors: string | any[] }) => {
                const data = {
                    [dbClass]: response.successes.map((k: { _source: any; _id: any }) => convertKuzzleResponse(k)),
                    fetchedCount: response.successes.length
                }
                if (response.errors.length > 0) ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle mGet, no docs with this itemsIds for ' + dbClassV + ': ' + response.errors })

                if (debug > 0) console.timeEnd(dbClassV + ' mGet time')

                return data
            }).catch((error: { message: string }) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle mGet ' + dbClassV + ': ' + error.message }))
    )
}

export default mGet