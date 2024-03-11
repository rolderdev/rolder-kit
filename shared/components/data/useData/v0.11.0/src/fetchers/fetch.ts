import { dbClassVersion } from "@shared/get-dbclass-version"
import { DataScheme } from "../../types"
import fetchUsers from "./fetchUsers"
import flush from "just-flush"
import { Item } from "@shared/types"

export default async function (queryContext: any): Promise<Item[] | void> {
    const { dbName } = window.R.env
    const [dataScheme]: DataScheme[] = queryContext.queryKey
    const { dbClass, query, sort, options, getUsers } = dataScheme
    const dbClassV = dbClassVersion(dbClass)

    const { Kuzzle } = window.R.libs
    if (!Kuzzle) { log.error('No Kuzzle instance'); return }

    const startTime = log.start()

    await Kuzzle.connect()
    if (dbName && dbClassV) return Kuzzle.document.search(dbName, dbClassV, { query, sort }, { ...options, lang: 'koncorde' })
        .then(kResponse => {
            let Items = kResponse.hits?.map(kItem => ({ id: kItem._id, ...kItem._source })) as Item[]
            if (getUsers) {
                const userIds = flush(Items?.filter(i => i.user?.id).map(i => i.user?.id))
                if (userIds?.length) {
                    return fetchUsers(userIds, Items).then(ItemsWithUser => {
                        log.end(`${dbClassV} fetch`, startTime)
                        return ItemsWithUser
                    })
                } else {
                    log.end(`${dbClassV} fetch`, startTime)
                    return Items
                }
            } else {
                log.end(`${dbClassV} fetch`, startTime)
                return Items
            }
        }).catch((e) => {
            R.libs.mantine?.MantineError('Системная ошибка!', `Fetch ${dbClassV} error: ${e.message}`)
            log.error(`Fetch ${dbClassV} error`, e.message)            
        })
}