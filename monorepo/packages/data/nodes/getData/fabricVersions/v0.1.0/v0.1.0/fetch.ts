import { time } from "../../../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../../../mantine/utils/errorHandler/v0.2.0/ErrorHandler"
import { dbClassVersion, dbVersion } from "../../../../../utils/getVersion/v0.3.0/getVersion"

export default async function (dbClass: string, filters: Filters, sorts: Sorts, options: Options): Promise<RItem[] | void> {
    const { Kuzzle } = window.R.libs

    await Kuzzle.connect()
    return Kuzzle.document.search(dbVersion(), dbClassVersion(dbClass), { query: filters, sort: sorts }, { ...options, lang: 'koncorde' })
        .then((kResponse: KResponse) => {
            time(`${dbClass} fetch`, true)
            return kResponse.hits?.map(kItem => ({ id: kItem._id, ...kItem._source })) as RItem[]

        }).catch((error) => {
            ErrorHandler('Системная ошибка!', `Fetcher error: ${error.message}`)
            console.error(error)
        })
}