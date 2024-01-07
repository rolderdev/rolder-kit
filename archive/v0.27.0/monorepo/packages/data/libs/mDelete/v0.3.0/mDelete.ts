import { ArgsDocumentControllerCreate } from "kuzzle-sdk"
import { log, time } from "../../../../../utils/debug/log/v0.2.0/log"
import { dbClassVersion } from "../../../utils/getVersion/v0.5.0/getVersion"
import ErrorHandler from "../../../../mantine/utils/errorHandler/v0.2.0/ErrorHandler"

const mDelete = async (deleteScheme: DeleteScheme3) => {
    const { Kuzzle } = window.R.libs
    const { dbName } = window.R.env
    const { dbClass, ids } = deleteScheme

    const dbClassV = dbClassVersion(dbClass)
    const options: ArgsDocumentControllerCreate = { refresh: 'wait_for' }

    time(`mDelete`)
    log(`mDelete ${dbClassV} props`, { ids })

    await Kuzzle.connect()
    if (dbName) Kuzzle.document.mDelete(dbName, dbClassV, ids, options)
        .then((response: any) => {
            log(`mDelete ${dbClassV} props`, response)
            time(`mDelete`, true)
            return
        }).catch((error: any) => ErrorHandler('Системная ошибка!', 'Kuzzle mDelete ' + dbClassV + ': ' + error.message))
}

export default mDelete