import { log, time } from "../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../mantine/utils/errorHandler/v0.2.0/ErrorHandler"

export default async (updateUserScheme: UpdateUserScheme): Promise<RUser | void> => {
    const { Kuzzle } = window.R.libs
    const { set } = window.R.libs.just

    const { id, content, credentials } = updateUserScheme
    const options = { refresh: 'wait_for' }

    let userBody = content
    if (credentials?.local.notSecret) userBody
        ? set(userBody, ['credentials', 'local', 'notSecret'], credentials?.local.notSecret)
        : userBody = { credentials: { local: { notSecret: credentials?.local.notSecret } } }

    time('UpdateUser')
    log('UpdateUser props', updateUserScheme)

    await Kuzzle.connect()
    try {
        await Kuzzle.security.updateCredentials('local', id, credentials?.local)
        let rUser = updateUserScheme as RUser
        if (userBody) rUser = await Kuzzle.security.updateUser(id, userBody, options)
            .then((kUser: KUser) => { return { id: kUser._id, ...kUser._source } })
        time('UpdateUser', true)
        log('UpdateUser', rUser)
        return rUser
    } catch (e: any) {
        ErrorHandler('Системная ошибка!', `Kuzzle updateUser: ${e.message}`)
        console.error(e)
    }
}