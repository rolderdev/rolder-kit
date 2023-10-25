import { time } from "../../../../../../../../../utils/debug/log/v0.2.0/log"
import { dbClassVersion, dbVersion } from "../../../../../../../../data/utils/getVersion/v0.3.0/getVersion"
import ErrorHandler from "../../../../../../../utils/errorHandler/v0.2.0/ErrorHandler"
import fetchUsers from "../utils/fetchUsers"

export default async function (queryContext: any): Promise<RItem[] | void> {
    const { Kuzzle } = window.R.libs
    const { flush } = window.R.libs.just

    const [queryKey] = queryContext.queryKey
    const { dbClass, filters, sorts, options, getUsers } = queryKey

    await Kuzzle.connect()
    return Kuzzle.document.search(dbVersion(), dbClassVersion(dbClass), { query: filters, sort: sorts }, { ...options, lang: 'koncorde' })
        .then((kResponse: KResponse) => {
            let rItems = kResponse.hits?.map(kItem => ({ id: kItem._id, ...kItem._source })) as RItem[]
            if (getUsers) {
                const userIds = flush(rItems?.filter(i => i.user?.id).map(i => i.user?.id))
                if (userIds?.length) {
                    return fetchUsers(userIds, rItems).then(rItemsWithUser => {
                        time(`${dbClass} fetch`, true)
                        return rItemsWithUser
                    })
                } else {
                    time(`${dbClass} fetch`, true)
                    return rItems
                }
            } else {
                time(`${dbClass} fetch`, true)
                return rItems
            }
        }).catch((error) => {
            ErrorHandler('Системная ошибка!', `Fetcher error: ${error.message}`)
            console.error(error)
        })
}