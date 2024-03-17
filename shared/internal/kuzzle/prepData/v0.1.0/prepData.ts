import { DbClass, User } from "@shared/types"
import { dbClassVersion } from '@shared/get-dbclass-version'
import { getKuzzle } from '@shared/get-kuzzle'
import { Preferences } from '@capacitor/preferences'
import fetchConfig from "./src/fetchConfig"

export async function prepData() {
    const { dbName } = R.env
    if (!dbName) { log.error('DB name is empty'); return }

    const K = await getKuzzle()
    if (!K) { return }

    const startTime = log.start()

    try {
        const dbClassesResp = await K.document.search('config', 'dbclass_v1', {}, { size: 100 })
        const dbClasses: { [name: string]: DbClass } = {}
        dbClassesResp.hits.map(i => { dbClasses[i._source.name] = i._source as any })
        R.dbClasses = dbClasses
        await Preferences.set({ key: 'dbClasses', value: JSON.stringify(dbClasses) })
        log.info('DB classes', dbClasses)
        const credsResp: any = await fetchConfig()
        R.params.creds = credsResp
        await Preferences.set({ key: 'creds', value: JSON.stringify(credsResp) })
    } catch (e) { log.error('Get DB classes error', e) }

    let resultUser: User = { user: {} }

    try {
        const user = await K.auth.getCurrentUser()
        if (user._source.dbClass) {
            try {
                const dbClassV = dbClassVersion(user._source.dbClass)
                if (!dbClassV) { return }

                const kRes = await K.document.search(
                    dbName,
                    dbClassV,
                    { query: { equals: { 'user.id': user._id } } },
                    { lang: 'koncorde' }
                )
                const kItem = kRes.hits.find(i => i._source.user?.id === user._id)
                let rItem = {} as User
                if (kItem) {
                    rItem = {
                        ...kRes.hits[0]?._source,
                        id: kRes.hits[0]?._id,
                        user: { ...user._source, id: user._id }
                    } as any
                } else rItem = { user: { ...user._source, id: user._id } }
                resultUser = rItem

                if (!rItem.user?.role) log.info('No role at user system DB class', rItem)

            } catch (e) { log.error('Get user DB class error', e) }

        } else {
            resultUser = { user } as any

            if (!user._source.role) log.info('No role at user system DB class', user)
            log.info('No dbClass record at user system DB class', user)
        }

    } catch (e) { log.error('Get user system DB class error', e) }

    R.user = resultUser
    log.end('Prepare data', startTime)

    return resultUser
}