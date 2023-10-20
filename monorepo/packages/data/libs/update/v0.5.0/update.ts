import { ArgsDocumentControllerCreate } from "kuzzle-sdk"
import { dbClassVersion, dbVersion } from "../../../utils/getVersion/v0.3.0/getVersion"
import deepFlush from "../../../utils/deepFlush/v0.2.0/deepFlush"
import { log, time } from "../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../mantine/libs/errorHandler/v0.2.0/ErrorHandler"

export default async (updateItem: UpdateItem, kuzzleOptions?: KuzzleOptions): Promise<RItem | void> => {
    const { Kuzzle } = window.R.libs
    const { dbClass, id, body } = updateItem
    const options: ArgsDocumentControllerCreate = {
        refresh: kuzzleOptions
            ? kuzzleOptions.refresh ? 'wait_for' : 'false'
            : 'wait_for',
        silent: kuzzleOptions?.silent
    }
    const dbClassV = dbClassVersion(dbClass)
    const flushedBody = deepFlush(body)

    time(`${dbClassV} update`)
    log(`${dbClassV} props`, { dbClass, id, flushedBody, options })

    return Kuzzle.connect().then(() =>
        Kuzzle.document.update(dbVersion(), dbClassV, id, flushedBody, options)
            .then(kItem => {
                const rItem = { id: kItem._id, ...kItem._source } as RItem

                log(`${dbClassV} updated`, rItem)
                time(`${dbClassV} create`, true)

                return rItem
            }).catch((error) => {
                ErrorHandler('Системная ошибка!', `Kuzzle update ${dbClassV}: ${error.message}`)
                console.error(error)
            })
    )
}