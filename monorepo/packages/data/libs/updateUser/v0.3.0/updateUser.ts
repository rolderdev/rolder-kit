import { log, time } from "../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../mantine/libs/errorHandler/v0.2.0/ErrorHandler"
import deepFlush from "../../../utils/deepFlush/v0.2.0/deepFlush"

export default async (updateUser: UpdateUser): Promise<RItem> => {
    const { Kuzzle } = window.R.libs
    const { set } = window.R.libs.just

    const { id, body } = updateUser
    const options = { refresh: 'wait_for' }
    const flushedBody = deepFlush(body)

    const userBody = flushedBody.content
    if (body.credentials?.local.notSecret) set(userBody, ['credentials', 'local', 'notSecret'], body.credentials?.local.notSecret)
    
    time('UpdateUser')
    log('UpdateUser props', { id, flushedBody, options })

    return Kuzzle.connect().then(() =>
        Kuzzle.security.updateCredentials('local', id, flushedBody.credentials?.local)
            .then(() => {
                if (userBody) Kuzzle.security.updateUser(id, userBody, options)
                    .then((kUser: KUser) => {
                        const rUser = { id: kUser._id, ...kUser._source }

                        time('UpdateUser', true)
                        log('UpdateUser', rUser)

                        return rUser
                    })
                else {
                    time('UpdateUser', true)
                    log('UpdateUser', flushedBody)
                    return flushedBody
                }
            }).catch((error) => {
                ErrorHandler('Системная ошибка!', `Kuzzle updateUser: ${error.message}`)
                console.error(error)
            })
    )
}