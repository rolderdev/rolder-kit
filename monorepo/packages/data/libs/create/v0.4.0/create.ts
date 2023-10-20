import { ArgsDocumentControllerCreate } from "kuzzle-sdk"
import { log, time } from "../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../mantine/libs/errorHandler/v0.2.0/ErrorHandler"
import deepFlush from "../../../utils/deepFlush/v0.2.0/deepFlush"
import { dbClassVersion, dbVersion } from "../../../utils/getVersion/v0.3.0/getVersion"

export default async (createItem: CreateItem, kuzzleOptions?: KuzzleOptions): Promise<RItem | void> => {
    const { Kuzzle } = window.R.libs
    const { dbClass, body } = createItem
    const options: ArgsDocumentControllerCreate = {
        refresh: kuzzleOptions
            ? kuzzleOptions.refresh ? 'wait_for' : 'false'
            : 'wait_for',
        silent: kuzzleOptions?.silent
    }
    const dbClassV = dbClassVersion(dbClass)
    const flushedBody = deepFlush(body)

    time(`${dbClassV} create`)
    log(`${dbClassV} props`, { dbClass, body, options })

    return Kuzzle.connect().then(() =>
        Kuzzle.document.create(dbVersion(), dbClassV, flushedBody, undefined, options)
            .then(kItem => {
                const rItem = { id: kItem._id, ...kItem._source } as RItem

                log(`${dbClassV} props`, rItem)
                time(`${dbClassV} create`, true)

                return rItem
            }).catch((error) => {
                ErrorHandler('Системная ошибка!', `Kuzzle create ${dbClassV}: ${error.message}`)
                console.error(error)
            })
    )
}