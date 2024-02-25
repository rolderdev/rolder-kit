import { ArgsDocumentControllerCreate } from "kuzzle-sdk"
import { dbClassVersion } from "../../../utils/getVersion/v0.5.0/getVersion"
import { log, time } from "../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../mantine/utils/errorHandler/v0.2.0/ErrorHandler"

export default async (updateItem: UpdateItem, kuzzleOptions?: KuzzleOptions): Promise<RItem | void> => {
    const { Kuzzle } = window.R.libs
    const { dbName } = window.R.env
    const { dbClass, id, body } = updateItem
    const options: ArgsDocumentControllerCreate = {
        refresh: kuzzleOptions
            ? kuzzleOptions.refresh ? 'wait_for' : 'false'
            : 'wait_for',
        silent: kuzzleOptions?.silent
    }
    const dbClassV = dbClassVersion(dbClass)

    time(`${dbClassV} update`)
    log(`${dbClassV} props`, { dbClassV, id, body, options })

    await Kuzzle.connect()
    if (dbName) return Kuzzle.document.update(dbName, dbClassV, id, body, options)
        .then((kItem: any) => {
            const rItem = { id: kItem._id, ...kItem._source } as RItem

            time(`${dbClassV} update`, true)
            log(`${dbClassV} updated`, rItem)

            return rItem
        }).catch((error) => {
            ErrorHandler('Системная ошибка!', `Kuzzle update ${dbClassV}: ${error.message}`)
            console.error(error)
        })
}