import set from "just-safe-set"
import { UpdateUser } from "../types"
import { getKuzzle } from "@shared/get-kuzzle"

export default async (userData: UpdateUser): Promise<any> => {
    const K = await getKuzzle()
    if (!K) return

    const { id, content, credentials } = userData
    const options = { refresh: 'wait_for' }

    let userBody = content
    if (credentials?.local.notSecret) userBody
        ? set(userBody, ['credentials', 'local', 'notSecret'], credentials?.local.notSecret)
        : userBody = { credentials: { local: { notSecret: credentials?.local.notSecret } } }

    const startTime = log.start()
    log.info(`updateUser props`, { content, credentials })

    try {
        await K.security.updateCredentials('local', id, credentials?.local)
        let rUser: any = userData
        if (userBody) rUser = await K.security.updateUser(id, userBody, options)
            .then(kUser => { return { id: kUser._id, ...kUser._source } })
        log.info(`updatedUser`, rUser)
        log.end(`updateUser`, startTime)
        return rUser
    } catch (error: any) {
        R.libs.mantine?.MantineError?.('Системная ошибка!', `Kuzzle updateUser: ${error.message}`)
        log.error(`updateUser error`, error)
    }
}