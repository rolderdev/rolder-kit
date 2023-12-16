import { convertKuzzleResponse, dbVersion, dbClassVersion } from '../../../utils/data/v0.2.0/data'
import ErrorHandler from '../../errorHandler/v0.1.0/ErrorHandler'
import useData from '../../useData/v0.2.0/useData'

const create = async ({ dbClass, body }: { dbClass: string, body: any }) => {
    const Kuzzle = window.Kuzzle
    const { debug, dbClasses } = window.Rolder

    const index = dbVersion()
    const dbClassV = dbClassVersion(dbClass)

    if (debug > 0) console.time(dbClassV + ' create time')
    if (debug > 1) console.log(dbClassV + ' props:', { dbClass, body })

    return Kuzzle.connect().then(() =>
        Kuzzle.document.create(index, dbClassV, body, null, { refresh: 'wait_for' })
            .then((response: any) => {
                if (!dbClasses[dbClass].subscribe) useData.invalidate({ dbClass })
                const jsonItem = convertKuzzleResponse(response)
                if (debug > 1) console.log(dbClassV + ' created:', jsonItem)
                if (debug > 0) console.timeEnd(dbClassV + ' create time')
                return jsonItem
            })
            .catch((error: any) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle create ' + dbClassV + ': ' + error.message }))
    )
}

export default create