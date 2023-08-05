import { convertKuzzleResponse, dbClassVersion } from '../../../utils/data/v0.2.0/data'
import ErrorHandler from '../../errorHandler/v0.1.0/ErrorHandler'

async function get({ queryKey: [{ dbVersion, dbClass, itemId }] }: { queryKey: any }): Promise<any> {
    const { debug } = window.Rolder
    const Kuzzle = window.Kuzzle
    const dbClassV = dbClassVersion(dbClass)

    if (debug > 0) console.time(dbClassV + ' get time')

    return Kuzzle.connect().then(() =>
        Kuzzle.document.get(dbVersion, dbClassV, itemId)
            .then((response: any) => {
                const data = {
                    [dbClass]: [convertKuzzleResponse(response)]
                }

                if (debug > 0) console.timeEnd(dbClassV + ' get time')

                return data
            }).catch((error: { message: string }) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle get ' + dbClassV + ': ' + error.message }))
    )
}

export default get