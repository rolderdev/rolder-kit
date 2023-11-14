import { ArgsDocumentControllerCreate } from "kuzzle-sdk"
import { log, time } from "../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../mantine/utils/errorHandler/v0.2.0/ErrorHandler"
import { dbClassVersion } from "../../../utils/getVersion/v0.5.0/getVersion"

export default async (createScheme: CreateScheme): Promise<RItem[] | void> => {
    const { Kuzzle } = window.R.libs
    const { dbName } = window.R.env
    const { dbClass, items } = createScheme

    const options: ArgsDocumentControllerCreate = { refresh: 'wait_for' }

    const dbClassV = dbClassVersion(dbClass)
    const kItems = items.map(i => ({ body: i }))

    time(`${dbClassV} mCreate`)
    log(`mCreate ${dbClassV} props`, { dbClass, kItems, options })

    await Kuzzle.connect()
    if (dbName) return Kuzzle.document.mCreate(dbName, dbClassV, kItems, { ...options, retryOnConflict: 3 })
        .then(kResponse => {
            const rItems = kResponse.successes.map(kItem => ({ id: kItem._id, ...kItem._source })) as RItem[]

            if (kResponse.errors.length > 0) ErrorHandler(
                'Системная ошибка!',
                `Kuzzle mCreate errors at dbClass ${dbClassV}: ${JSON.stringify(kResponse.errors)}`
            )

            log(`${dbClassV} mCreated`, rItems)
            time(`${dbClassV} mCreate`, true)

            return rItems
        }).catch((error) => {
            ErrorHandler('Системная ошибка!', `Kuzzle mCreate ${dbClassV}: ${error.message}`)
            console.error(error)
        })
}