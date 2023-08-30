import ErrorHandler from '../../errorHandler/v0.1.0/ErrorHandler'
import { dbVersion, dbClassVersion } from '../../../utils/data/v0.2.0/data'
import useData from '../../useData/v0.2.0/useData'

const mDelete = async ({ dbClass, itemsIds }: { dbClass: string, itemsIds: string[] }) => {
    const Kuzzle = window.Kuzzle
    const { debug, dbClasses } = window.Rolder
    const index = dbVersion()
    const dbClassV = dbClassVersion(dbClass)

    if (debug > 0) console.time(dbClassV + ' mDelete time')
    if (debug > 1) console.log(dbClassV + ' props:', { dbClass, itemsIds })

    return Kuzzle.connect().then(() =>
        Kuzzle.document.mDelete(index, dbClassV, itemsIds, { refresh: 'wait_for' })
            .then((response: any) => {
                if (!dbClasses[dbClass].subscribe) useData.invalidate({ dbClass })

                if (debug > 1) console.log(dbClassV + ' mDelete:', response)
                if (debug > 0) console.timeEnd(dbClassV + ' mDelete time')
                return
            })
            .catch((error: any) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle mDelete ' + dbClassV + ': ' + error.message }))
    )
}

export default mDelete