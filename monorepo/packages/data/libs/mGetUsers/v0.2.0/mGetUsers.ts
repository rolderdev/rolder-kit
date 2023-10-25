import { time } from "../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../mantine/utils/errorHandler/v0.2.0/ErrorHandler"

export default async function (userIds: string[]): Promise<RUser[] | void> {
    const { Kuzzle } = window.R.libs
    const { set } = window.R.libs.just

    time('mGetUser')

    await Kuzzle.connect()
    try {
        const kResponse = await Kuzzle.security.mGetUsers(userIds)
        let users = kResponse.map((k: any) => ({ ...k._source, id: k._id }))
        await Promise.all(
            users.map((i: any) => Kuzzle.security.getCredentials('local', i.id))
        ).then((r) => users = users.map((i_1: any, idx: number) => {
            set(i_1, ['credentials', 'local', 'username'], r[idx].username)
            return i_1
        }))

        time('mGetUser', true)
        return users
    } catch (error: any) {
        ErrorHandler('Системная ошибка!', `Kuzzle mGetUsers: ${error.message}`)
        console.error(error)
    }
}