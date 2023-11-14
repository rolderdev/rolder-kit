import { time } from "../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../mantine/utils/errorHandler/v0.2.0/ErrorHandler"

export default async function (fetchScheme: FetchScheme5): Promise<RItem[] | void> {
    const { Kuzzle } = window.R.libs
    const { dbName, dbClass, query, sort, options } = fetchScheme

    time(`${dbName} ${dbClass} fetch`)
    await Kuzzle.connect()
    if (dbName) return Kuzzle.document.search(dbName, dbClass, { query, sort }, { ...options, lang: 'koncorde' })
        .then(kResponse => {
            let rItems = kResponse.hits?.map(kItem => ({ id: kItem._id, ...kItem._source })) as RItem[]
            time(`${dbName} ${dbClass} fetch`, true)
            return rItems
        }).catch((error) => {
            ErrorHandler('Системная ошибка!', `Fetch ${dbClass} error: ${error.message}`)
            console.error(error.message)
        })
}