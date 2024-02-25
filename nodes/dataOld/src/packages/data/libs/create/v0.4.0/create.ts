import { ArgsDocumentControllerCreate } from "kuzzle-sdk"
import { log, time } from "../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../mantine/utils/errorHandler/v0.2.0/ErrorHandler"
import { dbClassVersion } from "../../../utils/getVersion/v0.5.0/getVersion"

export default async (createItem: CreateItem, kuzzleOptions?: KuzzleOptions): Promise<RItem | void> => {
    const { Kuzzle } = window.R.libs
    const { dbName } = window.R.env
    const { dbClass, body } = createItem
    const options: ArgsDocumentControllerCreate = {
        refresh: kuzzleOptions
            ? kuzzleOptions.refresh ? 'wait_for' : 'false'
            : 'wait_for',
        silent: kuzzleOptions?.silent
    }
    const dbClassV = dbClassVersion(dbClass)

    time(`${dbClassV} create`)
    log(`${dbClassV} props`, { dbClassV, body, options })

    await Kuzzle.connect()
    if (dbName) return Kuzzle.document.create(dbName, dbClassV, body, undefined, options)
        .then((kItem: any) => {
            const rItem = { id: kItem._id, ...kItem._source } as RItem

            time(`${dbClassV} create`, true)
            log(`${dbClassV} props`, rItem)

            return rItem
        }).catch((error) => {
            ErrorHandler('Системная ошибка!', `Kuzzle create ${dbClassV}: ${error.message}`)
            console.error(error)
        })
}