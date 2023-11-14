import { ArgsDocumentControllerCreate } from "kuzzle-sdk"
import { dbClassVersion } from "../../../utils/getVersion/v0.5.0/getVersion"
import { log, time } from "../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../mantine/utils/errorHandler/v0.2.0/ErrorHandler"

export default async (updateScheme: UpdateScheme4): Promise<RItem[] | void> => {
    const { Kuzzle } = window.R.libs
    const { dbName } = window.R.env
    const { dbClass, items } = updateScheme

    const options: ArgsDocumentControllerCreate = { refresh: 'wait_for' }

    const dbClassV = dbClassVersion(dbClass)
    const kItems = items.map(i => {
        const kItem: any = { body: i, _id: i.id }
        delete kItem.body.id
        return kItem
    })

    time(`${dbClassV} mUpdate`)
    log(`mUpdate ${dbClassV} props`, { dbClass, kItems, options })

    await Kuzzle.connect()
    if (dbName) return Kuzzle.document.mUpdate(dbName, dbClassV, kItems, { ...options, retryOnConflict: 3 })
        .then(kResponse => {
            const rItems = kResponse.successes.map(kItem => ({ id: kItem._id, ...kItem._source })) as RItem[]

            if (kResponse.errors.length > 0) ErrorHandler(
                'Системная ошибка!',
                `Kuzzle mUpdate errors at dbClass ${dbClassV}: ${JSON.stringify(kResponse.errors)}`
            )

            log(`${dbClassV} mUpdated`, rItems)
            time(`${dbClassV} mUpdate`, true)

            return rItems
        }).catch((error) => {
            ErrorHandler('Системная ошибка!', `Kuzzle mUpdate ${dbClassV}: ${error.message}`)
            console.error(error)
        })
}