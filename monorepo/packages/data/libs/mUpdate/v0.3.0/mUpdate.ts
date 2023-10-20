import { ArgsDocumentControllerCreate } from "kuzzle-sdk"
import { dbClassVersion, dbVersion } from "../../../utils/getVersion/v0.3.0/getVersion"
import deepFlush from "../../../utils/deepFlush/v0.2.0/deepFlush"
import { log, time } from "../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../mantine/libs/errorHandler/v0.2.0/ErrorHandler"

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
    const flushedItems = items.map((i: any) => {
        i._id = i.id
        return deepFlush(i)
    })

    time(`${dbClassV} mUpdate`)
    log(`mUpdate ${dbClassV} props`, { dbClass, flushedItems, options })

    return Kuzzle.connect().then(() =>
        Kuzzle.document.mUpdate(dbVersion(), dbClassV, flushedItems, { ...options, retryOnConflict: 3 })
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