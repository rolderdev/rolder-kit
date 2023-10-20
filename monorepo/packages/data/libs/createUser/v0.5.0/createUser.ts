import { log, time } from '../../../../../utils/debug/log/v0.2.0/log'
import ErrorHandler from '../../../../mantine/libs/errorHandler/v0.2.0/ErrorHandler'
import deepFlush from '../../../utils/deepFlush/v0.2.0/deepFlush'

export default async (userData: CreateUser): Promise<RItem> => {
    const { Kuzzle } = window.R.libs
    const { body } = userData
    const options = { refresh: 'wait_for' }
    const flushedBody = deepFlush(body)

    const content = { ...flushedBody.content, credentials: { local: { notSecret: flushedBody.credentials?.local.notSecret } } }
    let credentials = flushedBody.credentials
    delete credentials?.local.notSecret

    time('CreateUser')
    log('CreateUser props', { content, credentials })

    return Kuzzle.connect().then(() =>
        Kuzzle.security.createUser(null, { content, credentials }, options)
            .then((kUser: KUser) => {
                kUser._source.credentials.local.username = credentials.local.username
                const rUser = { id: kUser._id, ...kUser._source }

                time('CreateUser', true)
                log('CreateUser', rUser)

                return rUser
            }).catch((error) => {
                ErrorHandler('Системная ошибка!', `Kuzzle createUser: ${error.message}`)
                console.error(error)
            })
    )
}