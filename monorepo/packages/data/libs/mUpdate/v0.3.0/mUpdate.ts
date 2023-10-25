import { ArgsDocumentControllerCreate } from "kuzzle-sdk"
import { dbClassVersion, dbVersion } from "../../../utils/getVersion/v0.3.0/getVersion"
import { log, time } from "../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../mantine/utils/errorHandler/v0.2.0/ErrorHandler"

export default async (updateItems: UpdateItems, kuzzleOptions?: KuzzleOptions): Promise<RItem[] | void> => {
    const { Kuzzle } = window.R.libs
    const { dbClass, items } = updateItems

    const options: ArgsDocumentControllerCreate = {
        refresh: kuzzleOptions
            ? kuzzleOptions.refresh ? 'wait_for' : 'false'
            : 'wait_for',
        silent: kuzzleOptions?.silent
    }

    const dbClassV = dbClassVersion(dbClass)
    const kItems = items.map((i: any) => {
        i._id = i.id
        return i
    })

    time(`${dbClassV} mUpdate`)
    log(`mUpdate ${dbClassV} props`, { dbClass, kItems, options })

    return Kuzzle.connect().then(() =>
        Kuzzle.document.mUpdate(dbVersion(), dbClassV, kItems, { ...options, retryOnConflict: 3 })
            .then(kResponse => {
                const rItems = kResponse.successes.map((kItem: KItem) => ({ id: kItem._id, ...kItem._source }))

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
    )
}