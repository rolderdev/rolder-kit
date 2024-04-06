import type { ArgsDocumentControllerCreate } from "kuzzle-sdk"
import type { UpdateScheme } from "../types"
import type { Item } from "types"
import { getKuzzle } from "@packages/get-kuzzle"
import { dbClassVersion } from '@packages/get-dbclass-version';

export default async (updateScheme: UpdateScheme): Promise<Item[] | void> => {
    const K = await getKuzzle()
    if (!K) return

    const { dbName } = R.env
    if (!dbName) {
        R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`)
        log.error('No dbName', R.env)
        return
    }

    const { dbClass, items } = updateScheme

    const options: ArgsDocumentControllerCreate = { refresh: 'wait_for' }

    const dbClassV = dbClassVersion(dbClass)
    const kItems = items.map(i => {
        const kItem: any = { body: i, _id: i.id }
        delete kItem.body.id
        return kItem
    })

    const startTime = log.start()
    log.info(`mUpdate ${dbClassV} props`, { dbClass, kItems, options })

    if (dbName && dbClassV) return K.document.mUpdate(dbName, dbClassV, kItems, { ...options, retryOnConflict: 3 })
        .then(kResponse => {
            const rItems = kResponse.successes.map(kItem => ({ id: kItem._id, ...kItem._source })) as Item[]

            if (kResponse.errors.length > 0) {
                R.libs.mantine?.MantineError?.('Системная ошибка!',
                    `Kuzzle mUpdate errors at dbClass ${dbClassV}: ${JSON.stringify(kResponse.errors)}`)
                log.error(`Kuzzle mUpdate errors at dbClass ${dbClassV}`, kResponse.errors)
            }

            log.info(`${dbClassV} mUpdated`, rItems)
            log.end(`${dbClassV} mUpdate`, startTime)

            return rItems
        }).catch((error) => {
            R.libs.mantine?.MantineError?.('Системная ошибка!', `Kuzzle mUpdate ${dbClassV}: ${error.message}`)
            log.error(`Kuzzle mUpdate ${dbClassV}:`, error)
        })
}