import { convertKuzzleResponses, dbClassVersion } from '../../../../../utils/data/v0.3.0/data'
import conLog from '../../../../../utils/debug/conLog/v0.1.0/conLog'
import ErrorHandler from '../../../../errorHandler/v0.1.0/ErrorHandler'

export default async function (props: { queryKey: QueryKey[] }) {
    const { dbClasses, dbVersion, query, options } = props.queryKey[0]
    const Kuzzle = window.Kuzzle
    const dbClassesV = dbClasses.map(c => dbClassVersion(c))

    conLog(dbClassesV, 'time')

    return Kuzzle.connect().then(() =>
        Kuzzle.query(
            {
                controller: 'document',
                action: 'search',
                targets: [{ index: dbVersion, collections: dbClassesV }],
                body: { query },
                ...options
            })
            .then((response: { result: { hits: any[]; total: any } }) => {
                const data = convertKuzzleResponses(response.result)

                conLog(dbClassesV, 'timeEnd')

                return data
            }).catch((error: { message: string }) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle search ' + dbClassesV.join(', ') + ': ' + error.message }))
    )
}