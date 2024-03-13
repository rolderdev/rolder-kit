import { ArgsDocumentControllerCreate } from "kuzzle-sdk"
import { CreateScheme } from "../types"
import { Item } from "@shared/types"
import { getKuzzle } from "@shared/get-kuzzle"
import { dbClassVersion } from '@shared/get-dbclass-version';

export default async (createScheme: CreateScheme): Promise<Item[] | void> => {
    const K = await getKuzzle()
    if (!K) return

    const { dbName } = R.env
    if (!dbName) {
        R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`)
        log.error('No dbName', R.env)
        return
    }

    const { dbClass, items } = createScheme

    const options: ArgsDocumentControllerCreate = { refresh: 'wait_for' }

    const dbClassV = dbClassVersion(dbClass)
    const kItems = items.map(i => ({ body: i }))

    const startTime = log.start()
    log.info(`mCreate ${dbClassV} props`, { dbClass, kItems, options })

    if (dbName && dbClassV) return K.document.mCreate(dbName, dbClassV, kItems, { ...options, retryOnConflict: 3 })
        .then(kResponse => {
            const rItems = kResponse.successes.map(kItem => ({ id: kItem._id, ...kItem._source })) as Item[]

            if (kResponse.errors.length > 0) {
                R.libs.mantine?.MantineError?.('Системная ошибка!',
                    `Kuzzle mCreate errors at dbClass ${dbClassV}: ${JSON.stringify(kResponse.errors)}`)
                log.error(`Kuzzle mCreate errors at dbClass ${dbClassV}`, kResponse.errors)
            }

            log.info(`${dbClassV} mCreated`, rItems)
            log.end(`${dbClassV} mCreate`, startTime)

            return rItems
        }).catch((error) => {
            R.libs.mantine?.MantineError?.('Системная ошибка!', `Kuzzle mCreate ${dbClassV}: ${error.message}`)
            log.error(`Kuzzle mCreate ${dbClassV}:`, error)
        })
}