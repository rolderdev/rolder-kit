import isEmpty from 'just-is-empty'
import { convertKuzzleResponses, dbClassVersion, dbVersion } from '../../../../utils/data/v0.3.0/data'
import conLog from '../../../../utils/debug/conLog/v0.1.0/conLog'
import ErrorHandler from '../../../errorHandler/v0.1.0/ErrorHandler'
import updateNoodlClass from '../../utils/updateNClasses/v0.1.0/updateNClasses'

export default async function (useQueryProps: any): Promise<NoodlDbClass> {
    const { Kuzzle, Noodl } = window
    const { dbClass: dbClasses, query, options } = useQueryProps.queryKey[0]
    const dbClassesV = dbClasses.map((c: any) => dbClassVersion(c))

    conLog(dbClassesV, 'time')

    return Kuzzle.connect().then(() =>
        Kuzzle.query(
            {
                controller: 'document',
                action: 'search',
                targets: [{ index: dbVersion(), collections: dbClassesV }],
                body: { query },
                ...options
            })
            .then((response: { result: { hits: any[]; total: number } }) => {
                conLog(dbClassesV, 'timeEnd')
                let data = convertKuzzleResponses(response.result)
                dbClasses.forEach((dbClass: string) => {
                    if (data?.[dbClass]) {
                        updateNoodlClass({ dbClass, rawItems: data[dbClass] })
                        Noodl.Objects[dbClass].fetchedCount = data[dbClass].length
                        data[dbClass] = Noodl.Objects[dbClass]
                    } else {
                        Noodl.Objects[dbClass].items = []
                        Noodl.Objects[dbClass].fetchedCount = 0
                        data[dbClass] = []
                    }
                })
                return data
            }).catch((error: { message: string }) =>
                ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle search ' + dbClassesV.join(', ') + ': ' + error.message }))
    )
}