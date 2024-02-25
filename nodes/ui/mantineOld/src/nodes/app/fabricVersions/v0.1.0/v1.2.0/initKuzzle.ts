import validateJwt from "../../../../../utils/validateJwt/v0.3.0/validateJwt"
import { sendOutput } from "../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { dbClassVersion } from "../../../../../utils/getVersion/v0.5.0/getVersion"
import { log, time } from "../../../../../utils/debug/log/v0.2.0/log"

export default async function (noodlNode: NoodlNode) {
    const { project, envVersion, dbVersion } = window.R.env

    const Kuzzle = new window.KuzzleInit.Kuzzle(
        new window.KuzzleInit.WebSocket(`${project}.kuzzle.${envVersion}.rolder.app`, { port: 443 })
    )
    window.R.libs.Kuzzle = Kuzzle
    /// old app compatibility ///
    window.Kuzzle = Kuzzle

    await Kuzzle.connect()
    const jwtValid = await validateJwt()
    if (jwtValid) {
        const user = await Kuzzle.auth.getCurrentUser()
        if (user._source.dbClass) {
            const kRes = await Kuzzle.document.search(
                `${project}_v${dbVersion}`,
                dbClassVersion(user._source.dbClass),
                { query: { equals: { 'user.id': user._id } } },
                { lang: 'koncorde' }
            )
            const kItem = kRes.hits.find(i => i._source.user?.id === user._id)
            let rItem: any = { user: {} }
            if (kItem) rItem = { ...kRes.hits[0]?._source, id: kRes.hits[0]?._id }
            rItem.user = { ...user._source, id: user._id }
            window.R.user = rItem
            sendOutput(noodlNode, 'userRole', rItem.user.role?.value)

        } else sendOutput(noodlNode, 'userRole', user._source.role?.value)

        await Kuzzle.document.search('config', 'dbclass_v1', {}, { size: 100 }).then((r) => {
            const dbClasses: any = {}
            r.hits.map(i => {
                dbClasses[i._source.name] = {
                    version: i._source.version
                }
            })
            window.R.dbClasses = dbClasses
        })
    } else {
        sendOutput(noodlNode, 'userRole', 'notAuthenticated')
    }

    Kuzzle.on('disconnected', (...args: any) => {
        time('Reconnect')
        log('Kuzzle disconnected:', args)
    })
    Kuzzle.on('reconnected', () => {
        time('Reconnect', true)
        log('Kuzzle reconnected')
    })
    Kuzzle.on('tokenExpired', () => {
        sendOutput(noodlNode, 'userRole', 'notAuthenticated')
        log('Token expired')
    })
}