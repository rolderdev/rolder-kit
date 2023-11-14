import { time } from "../../../../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../../../../mantine/utils/errorHandler/v0.2.0/ErrorHandler"
import { dbClassVersion } from "../../../../../../utils/getVersion/v0.5.0/getVersion"
import fetchUsers from "./fetchUsers"

export default async function (queryContext: any): Promise<RItem[] | void> {
    const { Kuzzle } = window.R.libs
    const { flush } = window.R.libs.just
    const { dbName } = window.R.env
    const [dataScheme]: DataScheme[] = queryContext.queryKey
    const { dbClass, query, sort, options, getUsers } = dataScheme

    time(`${dbClass} fetch`)
    await Kuzzle.connect()
    if (dbName) return Kuzzle.document.search(dbName, dbClassVersion(dbClass), { query, sort }, { ...options, lang: 'koncorde' })
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
            ErrorHandler('Системная ошибка!', `Fetch ${dbClass} error: ${error.message}`)
            console.error(error.message)
        })
}