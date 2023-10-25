import { log, time } from '../../../../../utils/debug/log/v0.2.0/log'
import ErrorHandler from '../../../../mantine/utils/errorHandler/v0.2.0/ErrorHandler'

export default async (userData: CreateUser): Promise<RItem> => {
    const { Kuzzle } = window.R.libs
    const { body } = userData
    const options = { refresh: 'wait_for' }

    const content = { ...body.content, credentials: { local: { notSecret: body.credentials?.local.notSecret } } }
    let credentials = body.credentials
    delete credentials?.local.notSecret

    time('CreateUser')
    log('CreateUser props', { content, credentials })

    return Kuzzle.connect().then(() =>
        Kuzzle.security.createUser(null, { content, credentials }, options)
            .then((kUser: KUser) => {
                kUser._source.credentials.local.username = credentials?.local.username
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