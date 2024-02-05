import { time } from "../../../../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../../../../mantine/utils/errorHandler/v0.2.0/ErrorHandler"
import validateJwt from "../../../../../../../mantine/utils/validateJwt/v0.3.0/validateJwt"
import { dbClassVersion } from "../../../../../../utils/getVersion/v0.5.0/getVersion"
import fetchUsers from "./fetchUsers"

export default async function (queryContext: any): Promise<{ items: RItem[], total: number, aggregations: any } | void> {
    const { Kuzzle } = window.R.libs
    const { flush } = window.R.libs.just
    const { dbName } = window.R.env
    const [dataScheme]: DataScheme12[] = queryContext.queryKey
    const { dbClass, filters, sorts, size, searchAfter, getUsers, aggQuery: aggregations } = dataScheme
    const dbClassV = dbClassVersion(dbClass)
    const sort = [...sorts || [], { _id: 'asc' }]

    time(`${dbClassV} fetch`)
    await Kuzzle.connect()

    if (dbName) {
        try {
            // hack
            const r = await Kuzzle.isAuthenticated()
            if (!r) {
                console.log('fetch validateJwt')
                await validateJwt()
            }
            let results = await Kuzzle.document.search(
                dbName,
                dbClassV,
                { query: filters, sort, search_after: searchAfter, aggregations },
                { lang: 'koncorde', size }
            )
            let items = results.hits.map(i => ({ ...i._source, id: i._id })) as RItem[]

            if (getUsers) {
                const userIds = flush(items?.filter(i => i.user?.id).map(i => i.user?.id))
                if (userIds?.length) items = await fetchUsers(userIds, items)
            }

            time(`${dbClassV} fetch`, true)
            return { items, total: results.total, aggregations: results.aggregations }
        } catch (error: any) {
            ErrorHandler('Системная ошибка!', `Fetch ${dbClassV} error: ${error.message}`)
            console.error(error.message)
        }
    }
}