import { log, time } from "../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../mantine/utils/errorHandler/v0.2.0/ErrorHandler"

const mDeleteUsers = async (deleteUserIds: string[]) => {
    const { Kuzzle } = window.R.libs

    time(`mDeleteUsers`)
    log(`mDeleteUsers props`, { deleteUserIds })

    await Kuzzle.connect()
    Kuzzle.security.mDeleteUsers(deleteUserIds, { refresh: 'wait_for' })
        .then((response: any) => {
            time(`mDeleteUsers`, true)
            log(`mDeleteUsers`, response)
            return
        }).catch((error: any) => ErrorHandler('Системная ошибка!', 'Kuzzle mDeleteUsers: ' + error.message))
}

export default mDeleteUsers