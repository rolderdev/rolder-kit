import extend from "just-extend"
import conLog from "../../../../../../utils/debug/conLog/v0.1.0/conLog"
import ErrorHandler from "../../../../../errorHandler/v0.1.0/ErrorHandler"
import { createNUserClass } from "../../../../1_transform/create/v0.1.0/createNDBClass"
import { convertKUser } from "../../../../1_transform/tools/convertK/v0.1.0/convertK"

export default async function (userIds: string[]): Promise<NDBClass> {
    const { Kuzzle } = window

    conLog('mGetUser', 'time')

    return Kuzzle.connect().then(() =>
        Kuzzle.security.mGetUsers(userIds)
            .then(async (kUsers: KUser[]) => {
                const rUsers = convertKUser(kUsers)
                const creds = await Promise.all(rUsers.map(r => Kuzzle.security.getCredentials('local', r.id)))
                const users = rUsers.map((rUser, idx) =>
                    extend(true, rUser, { credentials: { local: { username: creds[idx].username } } })) as RUser[]
                conLog('mGetUser', 'timeEnd')
                return createNUserClass({ fetched: users.length }, rUsers)
            }).catch((error: { message: string }) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle mGetUsers: ' + error.message }))
    )
}