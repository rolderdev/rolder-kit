import { convertKuzzleResponse, dbClassVersion, dbVersion } from '../../../../utils/data/v0.3.0/data'
import conLog from '../../../../utils/debug/conLog/v0.1.0/conLog'
import ErrorHandler from '../../../errorHandler/v0.1.0/ErrorHandler'
import updateNoodlClass from '../../utils/updateNClasses/v0.1.0/updateNClasses'

export default async function (useQueryProps: any): Promise<NoodlDbClass> {
    const { Kuzzle, Noodl } = window
    const { dbClass, filters, sorts, options } = useQueryProps.queryKey[0]
    const dbClassV = dbClassVersion(dbClass)

    conLog(dbClassV, 'time')

    return Kuzzle.connect().then(() =>
        Kuzzle.document.search(dbVersion(), dbClassV, { query: filters, sort: sorts }, { ...options })
            .then((response: KuzzleResponse) => {
                const rawItems = response.hits?.map(k => convertKuzzleResponse(k))
                updateNoodlClass({ dbClass, rawItems })
                Noodl.Objects[dbClass].fetchedCount = response.fetched
                Noodl.Objects[dbClass].totalCount = response.total
                conLog(dbClassV, 'timeEnd')
                return Noodl.Objects[dbClass]
            }).catch((error: { message: string }) =>
                ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle fetch ' + dbClassV + ': ' + error.message }))
    )
}