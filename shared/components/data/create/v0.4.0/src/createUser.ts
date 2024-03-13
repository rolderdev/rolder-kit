import { CreateUser } from "../types"
import { getKuzzle } from "@shared/get-kuzzle"

export default async (userData: CreateUser): Promise<any> => {
    const K = await getKuzzle()
    if (!K) return

    const options = { refresh: 'wait_for' }

    const content = { ...userData.content, credentials: { local: { notSecret: userData.credentials?.local.notSecret } } }
    let credentials = userData.credentials
    delete credentials?.local.notSecret

    const startTime = log.start()
    log.info(`createUser props`, { content, credentials })

    return K.security.createUser(null, { content, credentials }, options)
        .then(kUser => {
            kUser._source.credentials.local.username = credentials?.local.username
            const rUser = { id: kUser._id, ...kUser._source }

            log.info(`createdUser`, rUser)
            log.end(`createUser`, startTime)

            return rUser
        }).catch((error) => {
            R.libs.mantine?.MantineError?.('Системная ошибка!', `Kuzzle createUser: ${error.message}`)
            log.error(`createUser error`, error)
        })
}